import { BrowserRouter } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import { Router } from "./Router/Router";
import ChatBot from "./components/chatbot/ChatBot";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Router />
        <ChatBot />
      </div>
    </BrowserRouter>
  );
}

export default App;
