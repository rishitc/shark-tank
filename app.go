package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"text/template"
	"time"
)

const debugMode = !true

// App struct
type Message struct {
	Message string
	Name    string
	IsShark bool
	role    Role
}

type App struct {
	ctx          context.Context
	sonarAPIKey  string
	persona      string
	conversation []Message
	sonarClient  *http.Client
	formData     Idea
	pitchPrompt  string
}

// NewApp creates a new App application struct
func NewApp() *App {
	personaFilePath := filepath.Join("prompts", "personas", "mark-cuban.md")
	data, err := os.ReadFile(personaFilePath)
	if err != nil {
		return &App{}
	}

	pitchPromptFilePath := filepath.Join("prompts", "pitch-template.md")
	pitchPrompt, err := os.ReadFile(pitchPromptFilePath)
	if err != nil {
		return &App{
			persona: string(data),
		}
	}

	credentialsFilePath := "credentials.json"
	rawCredentials, err := os.ReadFile(credentialsFilePath)
	if err != nil {
		return &App{
			persona:     string(data),
			pitchPrompt: string(pitchPrompt),
		}
	}
	credentials := map[string]string{}
	err = json.Unmarshal(rawCredentials, &credentials)
	if err != nil {
		return &App{
			persona:     string(data),
			pitchPrompt: string(pitchPrompt),
		}
	}

	a := &App{
		persona:     string(data),
		pitchPrompt: string(pitchPrompt),
		sonarAPIKey: credentials["sonar_api_key"],
		sonarClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
	fmt.Printf("App: %+v\n", a)
	return a
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) LoadPrompts() []Message {
	fmt.Printf("Loading prompts\n")
	return a.conversation
}

type RawFormData struct {
	CompanyName        string
	FounderName        string
	ImpactStatement    string
	Problem            string
	ProductDescription string
	Revenue            string
	FundingRaised      string
	Valuation          string
	OfferAmount        string
	OfferPercentage    string
	InvestmentPurpose  string
	Industry           string
}

type Idea struct {
	CompanyName        string
	FounderName        string
	ImpactStatement    string
	Problem            string
	ProductDescription string
	Revenue            int64
	FundingRaised      int64
	Valuation          int64
	OfferAmount        int64
	OfferPercentage    int64
	InvestmentPurpose  string
	Industry           string
}

func (a *App) ProcessIdeaForm(rawFormData RawFormData) error {
	formData, err := processRawFormData(rawFormData)
	if err != nil {
		fmt.Printf("Error processing form data: %v\n", err)
		return err
	}
	fmt.Printf("Form data: %+v\n", formData)
	a.formData = formData

	sb := strings.Builder{}

	funcMap := template.FuncMap{
		"formatMoney": func(i int64) string {
			// Format money with commas for thousands
			if i < 1000 {
				return fmt.Sprintf("$%d", i)
			}

			// Convert to string and add commas
			str := strconv.FormatInt(i, 10)
			var result strings.Builder

			for idx, char := range str {
				if idx > 0 && (len(str)-idx)%3 == 0 {
					result.WriteRune(',')
				}
				result.WriteRune(char)
			}

			return "$" + result.String()
		},
	}
	t := template.Must(template.New("pitch").Funcs(funcMap).Parse(a.pitchPrompt))
	t.Execute(&sb, a.formData)
	pitchMessage := Message{
		Message: sb.String(),
		Name:    "You",
		IsShark: false,
		role:    RoleUser,
	}
	fmt.Printf("Pitch message: %+v\n", pitchMessage)
	initialConversion := []Message{
		// sharkPromptMessage,
		pitchMessage,
	}
	a.conversation = initialConversion

	var llmResponse string
	if !debugMode {
		llmResponse, err = a.sendToSonar()
		if err != nil {
			return err
		}
	} else {
		llmResponse = "Hello, how can I help you today?"
		time.Sleep(5 * time.Second)
		err = nil
	}

	if err != nil {
		return err
	}
	a.conversation = append(a.conversation, Message{
		Message: llmResponse,
		Name:    "Mark Cuban",
		IsShark: true,
		role:    RoleAssistant,
	})
	fmt.Printf("Conversation: %+v\n", a.conversation)
	return nil
}

func processRawFormData(rawFormData RawFormData) (Idea, error) {
	revenue, err := strconv.ParseInt(rawFormData.Revenue, 10, 64)
	if err != nil {
		return Idea{}, err
	}
	fundingRaised, err := strconv.ParseInt(rawFormData.FundingRaised, 10, 64)
	if err != nil {
		return Idea{}, err
	}
	valuation, err := strconv.ParseInt(rawFormData.Valuation, 10, 64)
	if err != nil {
		return Idea{}, err
	}
	offerAmount, err := strconv.ParseInt(rawFormData.OfferAmount, 10, 64)
	if err != nil {
		return Idea{}, err
	}
	offerPercentage, err := strconv.ParseInt(rawFormData.OfferPercentage, 10, 64)
	if err != nil {
		return Idea{}, err
	}
	return Idea{
		CompanyName:        rawFormData.CompanyName,
		FounderName:        rawFormData.FounderName,
		ImpactStatement:    rawFormData.ImpactStatement,
		Problem:            rawFormData.Problem,
		ProductDescription: rawFormData.ProductDescription,
		Revenue:            revenue,
		FundingRaised:      fundingRaised,
		Valuation:          valuation,
		OfferAmount:        offerAmount,
		OfferPercentage:    offerPercentage,
		InvestmentPurpose:  rawFormData.InvestmentPurpose,
		Industry:           rawFormData.Industry,
	}, nil
}

// ProcessUserInput processes the user's input and returns a response
func (a *App) ProcessUserInput(userResponse string) string {
	if a.persona == "" {
		return "No persona selected"
	}

	a.conversation = append(a.conversation, Message{
		Message: userResponse,
		Name:    "You",
		IsShark: false,
		role:    RoleUser,
	})

	var llmResponse string
	if !debugMode {
		var err error
		llmResponse, err = a.sendToSonar()
		if err != nil {
			return "Error sending to Sonar " + err.Error()
		}
	} else {
		llmResponse = "Hello, how can I help you today?"
	}

	a.conversation = append(a.conversation, Message{
		Message: llmResponse,
		Name:    "Mark Cuban",
		IsShark: true,
		role:    RoleAssistant,
	})

	return llmResponse
}
