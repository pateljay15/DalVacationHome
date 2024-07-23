import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuthenticationToken } from "../../services/AuthenticationServices/AuthenticationServices";
import { toast } from "react-toastify";

const RoomCard = ({ room, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const auth = getAuthenticationToken();
  const role = auth?.auth?.payload["custom:role"];

  const handleViewDetails = () => {
    navigate(`/rooms/${room.roomid}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://23pxg3v9c6.execute-api.us-east-1.amazonaws.com/prod/rooms/${room.roomid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        onDelete(room.roomid);
        toast.success("Room deleted successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error("Failed to delete room", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 text-center cursor-pointer">
      <img
        src={room.imageUrl}
        alt={`Room ${room.roomNumber}`}
        className="mb-4 w-full"
      />
      <h3 className="text-lg font-bold">Room {room.roomNumber}</h3>
      <p className="text-gray-700">{room.price} per night</p>
      <button
        onClick={handleViewDetails}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-1"
      >
        View Details
      </button>
      {role == "1" && (
        <>
          <button
            onClick={() => onEdit(room)}
            className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-1"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default RoomCard;
