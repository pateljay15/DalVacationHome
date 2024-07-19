import React from 'react';
import { Link } from 'react-router-dom';

const agentDummyData = [
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

const AgentConcerns = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Assigned Concerns</h1>
        {agentDummyData.map((item) => (
          <Link to={`/agent/concern/${item.concernId}`} key={item.concernId} className="block">
            <div
              className="bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition"
            >
              <div className="flex-grow">
                <h2 className="text-lg font-semibold mb-2">{item.concernText}</h2>
                <p className="text-gray-600">Customer: {item.customerName}</p>
                <p className="text-gray-600">Date Raised: {item.dateRaised}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    item.isActive ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {item.isActive ? 'Active' : 'Resolved'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AgentConcerns;
