import React from "react";
import RoomForm from "../../components/RoomForm/RoomForm";

const RoomManagement = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-5">
        <h2 className="text-2xl font-bold mb-5">Add/Update Room</h2>
        <RoomForm />
      </div>
    </div>
  );
};

export default RoomManagement;
