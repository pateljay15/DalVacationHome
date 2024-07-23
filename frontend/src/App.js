import { BrowserRouter } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import { Router } from "./Router/Router";
import ChatBot from "./components/chatbot/ChatBot";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <NavBar />
        <Router />
        <ChatBot />
      </div>
    </BrowserRouter>
  );
}

export default App;
