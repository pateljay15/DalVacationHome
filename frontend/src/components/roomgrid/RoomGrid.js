import React, { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { roomsData } from "./dummydata";
import { fetchRooms } from "../../services/RoomManagementServices/RoomManagementServices";

// Dummy data for room details
// const roomsData = [
//     { id: 1, roomNumber: "101", price: "$50", imageUrl: "https://en.idei.club/uploads/posts/2023-08/thumbs/1691227156_en-idei-club-p-simple-hotel-room-images-dizain-vkontakte-32.jpg", features: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"] },
//     { id: 2, roomNumber: "102", price: "$60", imageUrl: "https://en.idei.club/uploads/posts/2023-08/thumbs/1691227156_en-idei-club-p-simple-hotel-room-images-dizain-vkontakte-32.jpg", features: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"] },
//     { id: 3, roomNumber: "103", price: "$55", imageUrl: "https://en.idei.club/uploads/posts/2023-08/thumbs/1691227156_en-idei-club-p-simple-hotel-room-images-dizain-vkontakte-32.jpg", features: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"] },
//     // Add more rooms as needed
//   ];

const RoomGrid = () => {
  const [roomsData, setRoomsData] = useState([]);

  useEffect(() => {
    fetch("https://fa7721ywbk.execute-api.us-east-1.amazonaws.com/room", {
      method: "GET",
    })
      .then((data) => data.json())
      .then((users) => setRoomsData(users))
      .catch((err) => console.log(err));
  }, []);

  const handleDeleteRoom = (roomId) => {
    setRoomsData(roomsData.filter((room) => room.roomid !== roomId));
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {roomsData.length > 0 &&
          roomsData.map((room) => (
            <RoomCard
              key={room.roomid}
              room={room}
              onDelete={handleDeleteRoom}
            />
          ))}
      </div>
    </div>
  );
};

export default RoomGrid;
