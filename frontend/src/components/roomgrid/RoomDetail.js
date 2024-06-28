// src/components/RoomDetail/RoomDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RoomDetail = ({ roomsData }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const room = roomsData.find(room => room.id === parseInt(roomId));

  if (!room) {
    return <div>Room not found</div>;
  }

  const discountedPrice = room.price - (room.price * room.discount / 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-5">
        <h2 className="text-2xl font-bold mb-5">Room {room.roomNumber}</h2>
        <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} className="mb-4 w-full" />
        <p className="text-gray-700 mb-4">Room Type: {room.roomType}</p>
        <p className="text-gray-700 mb-4">Description: {room.description}</p>
        <p className="text-gray-700 mb-4">
          Original Price: <span className="line-through">${room.price}</span>
        </p>
        <p className="text-gray-700 mb-4">
          Discounted Price: <span className="text-green-500">${discountedPrice.toFixed(2)}</span> ({room.discount}% off)
        </p>
        <p className="text-gray-700 mb-4">Availability: {room.availability}</p>
        <h3 className="text-xl font-bold mb-3">Features</h3>
        <ul className="list-disc list-inside mb-4">
          {room.features.map((feature, index) => (
            <li key={index} className="text-gray-700">{feature}</li>
          ))}
        </ul>
        <h3 className="text-xl font-bold mb-3">Comments</h3>
        <div className="bg-gray-200 p-3 rounded-lg mb-4">
          {room.comments.length > 0 ? (
            room.comments.map((comment, index) => (
              <p key={index} className="text-gray-700 mb-2">
                <span className="font-bold">{comment.user}:</span> {comment.comment}
              </p>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default RoomDetail;
