import React, { useState } from "react";
import RoomForm from "../../components/RoomForm/RoomForm";
import RoomGrid from "../../components/roomgrid/RoomGrid";
import { getAuthenticationToken } from "../../services/AuthenticationServices/AuthenticationServices";

function Home() {
  const [showForm, setShowForm] = useState(false);
  const auth = getAuthenticationToken();
  // console.log(auth)
  const role = auth?.auth?.payload["custom:role"];

  return (
    <div className="bg-gray-100">
      {/* Modal for RoomForm if showForm is true */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-10 flex items-center justify-center p-5">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <RoomForm />
            {/* Close button inside the modal to ensure it's clickable */}
            <button
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => setShowForm(false)}
            >
              Close Form
            </button>
          </div>
        </div>
      )}

      {/* Button fixed at the bottom right of the screen */}
      {role === "1" && (
        <button
          className="fixed bottom-5 left-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-20"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Form" : "Create Room"}
        </button>
      )}

      {/* Main content area where RoomGrid is displayed */}
      <div className="min-h-screen p-5">
        <RoomGrid />
      </div>
    </div>
  );
}

export default Home;
