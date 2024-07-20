import React from 'react';
import { useParams } from 'react-router-dom';

const dummyData = [
  {
    concernId: "1",
    concernText: "Leaky faucet in the kitchen",
    customerName: "Alice",
    customerEmail: "alice@example.com",
    agentName: "John Doe",
    agentEmail: "john.doe@example.com",
    dateRaised: "2023-07-16",
    isActive: true,
    chats: [
      {
        from: "agent",
        message: "We will fix the leaky faucet tomorrow.",
        timestamp: "2023-07-16T10:00:00Z"
      },
      {
        from: "customer",
        message: "Thank you!",
        timestamp: "2023-07-16T10:05:00Z"
      }
    ]
  },
  {
    concernId: "2",
    concernText: "Broken window in the living room",
    customerName: "Alice",
    customerEmail: "alice@example.com",
    agentName: "Jane Smith",
    agentEmail: "jane.smith@example.com",
    dateRaised: "2023-07-15",
    isActive: false,
    chats: [
      {
        from: "agent",
        message: "The window repair is scheduled for next Monday.",
        timestamp: "2023-07-15T09:00:00Z"
      },
      {
        from: "customer",
        message: "Got it. Thanks!",
        timestamp: "2023-07-15T09:05:00Z"
      }
    ]
  }
];

const ConcernChat = () => {
  const { concernId } = useParams();
  const concernData = dummyData.find(item => item.concernId === concernId);

  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log(`New message sent: ${newMessage}`);
      setNewMessage('');
    }
  };

  if (!concernData) {
    return <div>Concern not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">{concernData.concernText}</h2>
        <p className="mb-4"><strong>Agent Email:</strong> {concernData.agentEmail}</p>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Chat History:</h3>
          <div className="space-y-2">
            {concernData.chats.map((chat, index) => (
              <div key={index} className={`flex ${chat.from === 'agent' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`p-2 rounded-lg max-w-xs ${
                    chat.from === 'agent' ? 'bg-blue-100 text-blue-800 self-start' : 'bg-gray-100 text-gray-800 self-end'
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

export default ConcernChat;
