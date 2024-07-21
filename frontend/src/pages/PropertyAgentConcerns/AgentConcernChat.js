import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const AgentConcernChat = () => {
  const { concernId } = useParams();
  const location = useLocation();
  const [concernData, setConcernData] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchConcernData = async () => {
      try {
        const response = await fetch('https://us-central1-thematic-answer-427612-g9.cloudfunctions.net/ChatRetriever', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ agentEmail: location.state.concern.agentEmail }), // Replace with dynamic value if needed
        });
        const data = await response.json();
        const foundConcern = data.issues.find(issue => issue.concernId === concernId);
        setConcernData(foundConcern);
      } catch (error) {
        console.error('Error fetching concern data:', error);
      }
    };

    fetchConcernData();
  }, [concernId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const newChat = {
        from: 'agent',
        message: newMessage,
        timestamp: new Date().toISOString(),
      };

      const requestBody = {
        concernId: concernId,
        chats: [newChat],
      };

      try {
        const response = await fetch('https://us-central1-thematic-answer-427612-g9.cloudfunctions.net/ChatLogger', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          // Update the chat history in the local state
          setConcernData(prevData => ({
            ...prevData,
            chats: [...prevData.chats, newChat],
          }));
          setNewMessage('');
        } else {
          console.error('Failed to log chat:', response.statusText);
        }
      } catch (error) {
        console.error('Error logging chat:', error);
      }
    }
  };

  if (!concernData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">{concernData.concernText}</h2>
        <p className="mb-4"><strong>Customer Email:</strong> {concernData.customerEmail}</p>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Chat History:</h3>
          <div className="space-y-2">
            {concernData.chats.map((chat, index) => (
              <div key={index} className={`flex ${chat.from === 'agent' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-2 rounded-lg max-w-xs ${
                    chat.from === 'agent' ? 'bg-blue-100 text-blue-800 self-end' : 'bg-gray-100 text-gray-800 self-start'
                  }`}
                >
                  <span className="block font-semibold text-sm mb-1">
                    {chat.from === 'agent' ? 'Agent' : 'Customer'}
                  </span>
                  {chat.message}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentConcernChat;
