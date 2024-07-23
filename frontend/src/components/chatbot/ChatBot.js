import React, { useEffect, useState } from "react";
import "./ChatBot.css";
import { getAuthenticationToken } from "../../services/AuthenticationServices/AuthenticationServices";

const ChatBot = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const updateToken = () => {
      const auth = getAuthenticationToken();
      const newToken = auth?.auth?.jwtToken || null;
      setToken(newToken);
    };

    window.addEventListener("storage", updateToken);

    // Initial token setup
    updateToken();

    return () => {
      window.removeEventListener("storage", updateToken);
    };
  }, []);

  useEffect(() => {
    const postMessageToIframe = () => {
      const iframe = document.querySelector("df-messenger iframe");
      if (iframe && iframe.contentWindow) {
        console.log("Posting message to iframe:", { event: "open", data: { userRole: token } });
        iframe.contentWindow.postMessage(
          {
            event: "open",
            data: { userRole: token },
          },
          "*"
        );
      } else {
        console.log("Iframe or iframe.contentWindow is not available");
      }
    };

    // Retry logic
    let retries = 5;
    const interval = setInterval(() => {
      const iframe = document.querySelector("df-messenger iframe");
      if (iframe && iframe.contentWindow) {
        postMessageToIframe();
        clearInterval(interval);
      } else if (retries <= 0) {
        console.log("Iframe or iframe.contentWindow is still not available after retries");
        clearInterval(interval);
      } else {
        retries--;
        console.log(`Retrying to access iframe. Remaining retries: ${retries}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

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
    token ? (
      <df-messenger
        intent="vacbot_welcome"
        chat-title="DalVacationHome"
        agent-id="09dddef5-582f-4703-acd3-3f7ee1b45c11"
        language-code="en"
      ></df-messenger>
    ) : (
      <df-messenger
        intent="vacbot_welcome"
        chat-title="DalVacationHome"
        agent-id="8bba284c-1d7f-49fa-badd-2b4efa370253"
        language-code="en"
      ></df-messenger>
    )
  );
};

export default ChatBot;
