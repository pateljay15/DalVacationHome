import React, { useState } from "react";

const RoomForm = () => {
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    features: "",
    price: "",
    discountCode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setFormData({
        ...formData,
        price: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Room Number</label>
        <input
          type="text"
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleChange}
          className="w-full mt-2 p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Room Type</label>
        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
          className="w-full mt-2 p-2 border rounded"
          required
        >
          <option value="">Select Room Type</option>
          <option value="Single Room">Single Room</option>
          <option value="Double Room">Double Room</option>
          <option value="Suite">Suite</option>
          <option value="Recreation Room">Recreation Room</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Features</label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleChange}
          className="w-full mt-2 p-2 border rounded"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handlePriceChange}
          className="w-full mt-2 p-2 border rounded"
          required
          min="0"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Discount Code</label>
        <input
          type="text"
          name="discountCode"
          value={formData.discountCode}
          onChange={handleChange}
          className="w-full mt-2 p-2 border rounded"
        />
      </div>
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default RoomForm;
