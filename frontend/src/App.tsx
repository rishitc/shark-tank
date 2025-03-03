import { useState } from "react";
// import logo from "./assets/images/logo-universal.png";
import "./App.css";
import { ProcessUserInput } from "../wailsjs/go/main/App";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Message from "./components/message/message";
import Chat from './components/chat/chat';
import IdeaForm from "./components/idea-form/idea-from";

function App() {
  interface Message {
    text: string;
    name: string;
    isShark: boolean;
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Describe your idea and company in detail below. 👇",
      name: "Mark Cuban",
      isShark: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);

  function sendMessage() {
    setDisableSubmit(true);
    // Add user message
    const newMessages = [
      ...messages,
      {
        text: inputText,
        name: "You",
        isShark: false,
      },
    ];
    setMessages(newMessages);

    // Get response from backend
    ProcessUserInput(inputText).then((response: string) => {
      setMessages([
        ...newMessages,
        {
          text: response,
          name: "Mark Cuban",
          isShark: true,
        },
      ]);
      // Clear input
      setInputText("");
      // Enable submit button
      setDisableSubmit(false);
    });
  }

  return (
    <div id="App">
    <Router>
      <Routes>
        <Route path="/" element={<IdeaForm />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </div>
    // <div id="App">
    //   <div className="message-window">
    //     {messages.map((message, index) => (
    //       <Message key={index} text={message.text} name={message.name} isShark={message.isShark} />
    //     ))}
    //     <div ref={(el) => {
    //       if (el) {
    //         el.scrollIntoView({ behavior: "smooth" });
    //       }
    //     }} />
    //   </div>
    //   <div className="input-box">
    //     <textarea
    //       className="input"
    //       value={inputText}
    //       placeholder="Enter your message here..."
    //       onChange={(e) => {
    //         setInputText(e.target.value)
    //         if (e.target.value.length > 0) {
    //           setDisableSubmit(false);
    //         } else {
    //           setDisableSubmit(true);
    //         }
    //       }}
    //       onKeyUp={(e) => {
    //         if (e.key === "Enter") {
    //           sendMessage();
    //         }
    //       }}
    //     />
    //     <button
    //       className="btn"
    //       onClick={sendMessage}
    //       disabled={disableSubmit}
    //     >
    //       Submit
    //     </button>
    //   </div>
    // </div>
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
