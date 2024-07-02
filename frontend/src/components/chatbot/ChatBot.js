import React, { useEffect } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);

    const userRole = localStorage.getItem("userRole") || "guest";

    script.addEventListener("load", () => {
      const dfMessenger = document.querySelector("df-messenger");
      dfMessenger.addEventListener("df-messenger-loaded", function () {
        const iframe = document.querySelector("df-messenger iframe");
        iframe.contentWindow.postMessage(
          {
            event: "open",
            data: { userRole: userRole },
          },
          "*"
        );
      });
    });

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <df-messenger
      intent="vacbot_welcome"
      chat-title="VacBot"
      agent-id="09dddef5-582f-4703-acd3-3f7ee1b45c11"
      language-code="en"
    ></df-messenger>
  );
};

export default ChatBot;
