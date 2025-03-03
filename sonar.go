package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type Role string

const (
	RoleUser      Role = "user"
	RoleAssistant Role = "assistant"
	RoleSystem    Role = "system"
)

type SonarRequestMessage struct {
	Role    Role   `json:"role"`
	Content string `json:"content"`
}

type SonarRequest struct {
	Model       string                `json:"model"`
	Messages    []SonarRequestMessage `json:"messages"`
	Temperature float64               `json:"temperature"`
}

type SonarResponse struct {
	ID      string `json:"id"`
	Created int    `json:"created"`
	Choices []struct {
		Index   int `json:"index"`
		Message struct {
			Role    Role   `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func (a *App) sendToSonar() (string, error) {
	const url = "https://api.perplexity.ai/chat/completions"

	// Collect the conversation into a list of SonarRequestMessage
	messages := []SonarRequestMessage{
		{
			Role:    RoleSystem,
			Content: a.persona,
		},
	}
	for _, c := range a.conversation {
		messages = append(messages, SonarRequestMessage{
			Role:    c.role,
			Content: c.Message,
		})
	}

	payload := SonarRequest{
		Model:       "sonar",
		Messages:    messages,
		Temperature: 0.75,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}
	payloadReader := strings.NewReader(string(payloadBytes))

	req, err := http.NewRequest(http.MethodPost, url, payloadReader)
	if err != nil {
		return "", err
	}

	req.Header.Add("Authorization", "Bearer "+a.sonarAPIKey)
	req.Header.Add("Content-Type", "application/json")

	// Add a timeout context for the request
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Create the request with the timeout context
	req = req.WithContext(ctx)
	res, err := a.sonarClient.Do(req)
	if err != nil {
		fmt.Println("Error sending to Sonar", err)
		return "", err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println("Error reading response", err)
		return "", err
	}

	fmt.Println(res)
	fmt.Println(string(body))
	var sonarResponse SonarResponse
	err = json.Unmarshal(body, &sonarResponse)
	if err != nil {
		fmt.Println("Error unmarshaling response", err)
		return "", err
	}

	return sonarResponse.Choices[0].Message.Content, nil
}
