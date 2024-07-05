import React, { useEffect, useState } from "react";
import "./ChatBot.css";
import { getAuthenticationToken } from "../../services/AuthenticationServices/AuthenticationServices";

const ChatBot = () => {
  const [userRole, setUserRole] = useState("");
  const auth = getAuthenticationToken();
  const role = auth?.auth?.payload["custom:role"] || "guest";

  useEffect(() => {
    const updateUserRole = () => {
      // const role = localStorage.getItem("userRole") || "guest";
      console.log("Retrieved userRole from localStorage:", role); // Log the retrieved userRole
      setUserRole(role);

      const iframe = document.querySelector("df-messenger iframe");
      if (iframe && iframe.contentWindow) {
        console.log("Posting message to iframe:", { event: "open", data: { userRole: role } }); // Log the message being posted to the iframe
        iframe.contentWindow.postMessage(
          {
            event: "open",
            data: { userRole: role },
          },
          "*"
        );
      } else {
        console.log("Iframe or iframe.contentWindow is not available"); // Log if iframe is not available
      }
    };

    window.addEventListener("storage", updateUserRole);

    // Initial user role setup
    updateUserRole();

    return () => {
      window.removeEventListener("storage", updateUserRole);
    };
  }, []);

  useEffect(() => {
    if (!document.querySelector('script[src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"]')) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <df-messenger
      intent="vacbot_welcome"
      chat-title="DalVacationHome"
      agent-id="09dddef5-582f-4703-acd3-3f7ee1b45c11"
      language-code="en"
    ></df-messenger>
  );
};

export default ChatBot;
