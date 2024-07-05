// src/components/RoomForm/RoomForm.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { postData } from '../../services/RoomManagementServices/RoomManagementServices';
import { getAuthenticationToken } from '../../services/AuthenticationServices/AuthenticationServices';
import { toast } from 'react-toastify';

const RoomForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    price: '',
    discount: '',
    image: '',
    roomType: 'Recreation Room', // Default to 'Recreation Room'
    description: '',
    features: '',
    fileName: ''
  });

  const auth = getAuthenticationToken()
  // console.log(auth)
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert features from string to array
    const formattedData = {
      ...formData,
      roomid: uuidv4(),
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount),
      features: formData.features.split(',').map(feature => feature.trim()),
      propertyAgent: auth.auth.payload["email"]
    };
    console.log(formattedData)
    postData(formattedData)
    .then(res => {
      console.log(res)
      toast.success("Room Created.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      // if (res.statusCode == 200) {
        // console.log(res)
        setFormData({
          roomNumber: '',
          price: '',
          discount: '',
          image: '',
          roomType: 'Recreation Room', // Reset to default
          description: '',
          features: '',
          fileName: '',
        });
      // }
    })
    .catch(err => {
      toast.error("Room Creation Failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    })
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                let img = reader.result.toString()
                let dam = img.split(",")
                console.log(dam[1])
                setFormData({...formData, image: dam[1], fileName: file.name })
            }
        };
        reader.readAsDataURL(file);
    }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-full">
      <h2 className="text-2xl font-bold mb-4">Create Room</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="block text-gray-700 mb-1">Room Number</label>
          <input
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 mb-1">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 mb-1">Image URL</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 mb-1">Room Type</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="Recreation Room">Recreation Room</option>
            <option value="Deluxe Room">Deluxe Room</option>
            <option value="Standard Room">Standard Room</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col">
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            rows="4"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 mb-1">Features (comma-separated)</label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
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

export default RoomForm;
