// src/components/RoomCard/RoomCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/rooms/${room.roomid}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 text-center cursor-pointer" onClick={handleClick}>
      <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} className="mb-4 w-full" />
      <h3 className="text-lg font-bold">Room {room.roomNumber}</h3>
      <p className="text-gray-700">{room.price} per night</p>
      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        View Details
      </button>
    </div>
  );
};

export default RoomCard;
