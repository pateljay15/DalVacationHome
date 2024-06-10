import React, { useState } from 'react';
import { lexRuntime } from '../../aws-config';
import './ChatBot.css'
import { REACT_APP_LEX_BOT_ALIAS, REACT_APP_LEX_BOT_NAME } from 'react-dotenv';

const ChatBot = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');

        const params = {
            botAlias: REACT_APP_LEX_BOT_ALIAS,
            botName: REACT_APP_LEX_BOT_NAME,
            inputText: input,
            userId: Date.now.toString(),
          };

        try {
            const response = await lexRuntime.postText(params).promise();
            setMessages([...newMessages, { text: response.message, sender: 'bot' }]);
        } catch (error) {
            console.error('Error communicating with Lex:', error);
            setMessages([...newMessages, { text: 'Error communicating with Lex', sender: 'bot' }]);
        }
    }
    
    return ( 
        <div className="chatbot-container">
            <div className="chatbot-window">
                {
                    messages.map((message, index) => (
                        <div key={index} className={message.sender}>
                            {message.text}
                        </div>
                    ))
                }
            </div>

            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage}
            />

            <button onClick={handleSendMessage}>Send</button>
        </div>
     )
}
 
export default ChatBot