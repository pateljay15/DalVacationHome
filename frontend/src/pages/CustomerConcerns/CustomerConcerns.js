import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuthenticationToken } from '../../services/AuthenticationServices/AuthenticationServices';

const CustomerConcerns = () => {
  const [concerns, setConcerns] = useState([]);
  const auth = getAuthenticationToken();
  const customerEmail = auth?.auth.payload.email; // Replace with dynamic value if needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://us-central1-thematic-answer-427612-g9.cloudfunctions.net/ChatRetriever', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerEmail }),
        });
        const data = await response.json();
        setConcerns(data.issues);
        console.log(data.issues);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [customerEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Customer Concerns</h1>
        {concerns.length > 0 ? (
          concerns.map((item) => (
            <Link to={`/concern/${item.concernId}`} key={item.concernId} state={{ concern: item }} className="block">
              <div
                className="bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition"
              >
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold mb-2">{item.concernText}</h2>
                  <p className="text-gray-600">Agent: {item.agentName}</p>
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
          ))
        ) : (
          <div className="text-center text-gray-600">You have no concerns raised as of now.</div>
        )}
      </div>
    </div>
  );
};

export default CustomerConcerns;
