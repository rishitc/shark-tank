import { useEffect, useState } from "react";
// import logo from "./assets/images/logo-universal.png";
import "./chat.css";
import { LoadPrompts, ProcessUserInput } from "../../../wailsjs/go/main/App";
import { main } from "../../../wailsjs/go/models";
import Message from "../message/message";

function App() {
  const [messages, setMessages] = useState<main.Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);

  useEffect(() => {
    LoadPrompts().then((messages) => {
      setMessages(messages);
    });
  }, [setMessages]);

  function sendMessage() {
    setDisableSubmit(true);
    // Add user message
    const newMessages = [
      ...messages,
      {
        Message: inputText,
        Name: "You",
        IsShark: false,
      },
    ];
    setMessages(newMessages);

    // Get response from backend
    ProcessUserInput(inputText).then((response: string) => {
      setMessages([
        ...newMessages,
        {
          Message: response,
          Name: "Mark Cuban",
          IsShark: true,
        },
      ]);
      // Clear input
      setInputText("");
    });
  }

  return (
    <div className="chat-container">
      <div className="message-window">
        {/* Bug below */}
        {messages.map((message, index) => (
          <Message
            key={index}
            text={message.Message}
            name={message.Name}
            isShark={message.IsShark}
          />
        ))}
        {/* Bug above */}
        <div
          ref={(el) => {
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
        ></div>
      </div>

      <div className="input-box">
        <textarea
          className="input"
          value={inputText}
          placeholder="Enter your message here..."
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value.length > 0) {
              setDisableSubmit(false);
            } else {
              setDisableSubmit(true);
            }
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button className="btn" onClick={sendMessage} disabled={disableSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

// function App() {
//     const [resultText, setResultText] = useState("Please enter your name below 👇");
//     const [name, setName] = useState('');
//     const updateName = (e: any) => setName(e.target.value);
//     const updateResultText = (result: string) => setResultText(result);

//     function greet() {
//         Greet(name).then(updateResultText);
//     }

//     return (
//         <div id="App">
//             <img src={logo} id="logo" alt="logo"/>
//             <div id="result" className="result">{resultText}</div>
//             <div id="input" className="input-box">
//                 <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
//                 <button className="btn" onClick={greet}>Greet</button>
//             </div>
//         </div>
//     )
// }

export default App;
