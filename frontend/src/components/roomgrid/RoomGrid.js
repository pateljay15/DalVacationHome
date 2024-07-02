import React, { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { roomsData } from "./dummydata";
import { fetchRooms } from "../../services/RoomManagementServices/RoomManagementServices";
import UpdateRoomForm from "../RoomForm/updateRoomForm";

// Dummy data for room details
// const roomsData = [
//     { id: 1, roomNumber: "101", price: "$50", imageUrl: "https://en.idei.club/uploads/posts/2023-08/thumbs/1691227156_en-idei-club-p-simple-hotel-room-images-dizain-vkontakte-32.jpg", features: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"] },
//     { id: 2, roomNumber: "102", price: "$60", imageUrl: "https://en.idei.club/uploads/posts/2023-08/thumbs/1691227156_en-idei-club-p-simple-hotel-room-images-dizain-vkontakte-32.jpg", features: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"] },
//     { id: 3, roomNumber: "103", price: "$55", imageUrl: "https://en.idei.club/uploads/posts/2023-08/thumbs/1691227156_en-idei-club-p-simple-hotel-room-images-dizain-vkontakte-32.jpg", features: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"] },
//     // Add more rooms as needed
//   ];

const RoomGrid = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

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

  const handleUpdateRoom = (updatedRoom) => {
    setRoomsData(
      roomsData.map((room) =>
        room.roomid === updatedRoom.roomid ? updatedRoom : room
      )
    );
    setSelectedRoom(null);
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
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
              onEdit={handleEditRoom}
            />
          ))}
      </div>

      {selectedRoom && (
        <UpdateRoomForm
          room={selectedRoom}
          onUpdate={handleUpdateRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default RoomGrid;
