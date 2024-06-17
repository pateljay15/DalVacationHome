import React, { useState, useEffect, useRef } from 'react';
import { lexRuntime } from '../../aws-config';
import './ChatBot.css'

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatWindowRef = useRef(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');

        const params = {
            botAlias: process.env.REACT_APP_LEX_BOT_ALIAS,
            botName: process.env.REACT_APP_LEX_BOT_NAME,
            inputText: input,
            userId: Date.now().toString(),
        };

        try {
            const response = await lexRuntime.postText(params).promise();
            setMessages([...newMessages, { text: response.message, sender: 'bot' }]);
        } catch (error) {
            console.error('Error communicating with Lex:', error);
            setMessages([...newMessages, { text: 'Error communicating with Lex', sender: 'bot' }]);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-window" ref={chatWindowRef}>
                {messages.map((message, index) => (
                    <div key={index} className={message.sender}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatBot;
