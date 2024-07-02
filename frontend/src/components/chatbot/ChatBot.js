import React, { useEffect } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || "guest";

    const handleMessengerLoaded = () => {
      const iframe = document.querySelector("df-messenger iframe");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            event: "open",
            data: { userRole: userRole },
          },
          "*"
        );
      }
    };

    const dfMessenger = document.querySelector("df-messenger");
    if (dfMessenger) {
      dfMessenger.addEventListener(
        "df-messenger-loaded",
        handleMessengerLoaded
      );
    }

    return () => {
      if (dfMessenger) {
        dfMessenger.removeEventListener(
          "df-messenger-loaded",
          handleMessengerLoaded
        );
      }
    };
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
