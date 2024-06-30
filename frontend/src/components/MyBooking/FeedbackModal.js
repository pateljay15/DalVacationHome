// src/components/RoomForm/RoomForm.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { postData } from '../../services/RoomManagementServices/RoomManagementServices';
import { getAuthenticationToken } from '../../services/AuthenticationServices/AuthenticationServices';

const FeedbackModal = ({ handleFeedbackSubmit }) => {
  const [feedback, setFeedback] = useState('');

  const auth = getAuthenticationToken()
  // console.log(auth)


  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert features from string to array
    handleFeedbackSubmit(feedback)
    setFeedback("")
  };

  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-full">
      <h2 className="text-2xl font-bold mb-4">Provide Feedback</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col">
          <label className="block text-gray-700 mb-1">Feedback</label>
          <textarea
            name="description"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            rows="4"
            required
          />
        </div>
        
      </div>
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Submit
      </button>
    </form>
  );
};

export default FeedbackModal;
