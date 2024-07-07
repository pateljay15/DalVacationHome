import React, { useState, useEffect } from "react";
import "./UpdateRoomForm.css";
import { toast } from "react-toastify";

const UpdateRoomForm = ({ room, onUpdate, onClose }) => {
  const [updatedRoom, setUpdatedRoom] = useState({
    ...room,
    comments: room.comments ? room.comments.join(", ") : "",
    features: room.features ? room.features.join(", ") : "",
  });
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    setUpdatedRoom({
      ...room,
      comments: room.comments ? room.comments.join(", ") : "",
      features: room.features ? room.features.join(", ") : "",
    });
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRoom({ ...updatedRoom, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result.replace("data:", "").replace(/^.+,/, ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...updatedRoom,
      image: newImage || updatedRoom.imageUrl,
      features: updatedRoom.features
        .split(",")
        .map((feature) => feature.trim()),
      comments: updatedRoom.comments
        .split(",")
        .map((comment) => comment.trim()),
    };

    try {
      const response = await fetch(
        "https://m8vmpx90x4.execute-api.us-east-1.amazonaws.com/pod/rooms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const updatedRoomData = await response.json();
        onUpdate(updatedRoomData);
        toast.success("Room updated", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
        onClose();
      } else {
        toast.error("Failed to update room", {
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
      console.error("Error updating room:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <h2>Update Room</h2>
          <label>
            Room Number:
            <input
              type="text"
              name="roomNumber"
              value={updatedRoom.roomNumber}
              readOnly
            />
          </label>
          <label>
            Price:
            <input
              type="text"
              name="price"
              value={updatedRoom.price}
              onChange={handleChange}
            />
          </label>
          <label>
            Discount:
            <input
              type="text"
              name="discount"
              value={updatedRoom.discount}
              onChange={handleChange}
            />
          </label>
          <label>
            Image:
            <input type="file" onChange={handleImageChange} />
          </label>
          <label>
            Room Type:
            <select
              name="roomType"
              value={updatedRoom.roomType}
              onChange={handleChange}
              className="dropdown"
            >
              <option value="Recreation Room">Recreation Room</option>
              <option value="Deluxe Room">Deluxe Room</option>
              <option value="Standard Room">Standard Room</option>
            </select>
          </label>
          <label>
            Availability:
            <select
              name="availability"
              value={updatedRoom.availability}
              onChange={handleChange}
              className="dropdown"
            >
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={updatedRoom.description}
              onChange={handleChange}
            ></textarea>
          </label>
          <label>
            Features (comma separated):
            <textarea
              name="features"
              value={updatedRoom.features}
              onChange={handleChange}
            ></textarea>
          </label>
          <label>
            Comments:
            <textarea
              name="comments"
              value={updatedRoom.comments}
              readOnly
            ></textarea>
          </label>
          <label>
            Property Agent:
            <input
              type="text"
              name="propertyAgent"
              value={updatedRoom.propertyAgent}
              readOnly
            />
          </label>
          <button type="submit">Update Room</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoomForm;
