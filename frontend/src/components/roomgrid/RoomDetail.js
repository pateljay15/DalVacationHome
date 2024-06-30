import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { roomsData } from './dummydata';
import { postBookingData } from '../../services/BookingServices/BookingServices';
import { getAuthenticationToken } from '../../services/AuthenticationServices/AuthenticationServices';

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const auth = getAuthenticationToken()
  const role = auth?.auth?.payload["custom:role"]
  const [room, setRoom] = useState({});
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    roomNumber: '',
    roomType: '',
    roomPrice: '',
    startDate: '',
    endDate: '',
    message: ''
  });

  useEffect(() => {
    console.log(roomId);
    fetch("https://fa7721ywbk.execute-api.us-east-1.amazonaws.com/room/" + roomId)
      .then(data => data.json())
      .then(roomdata => {
        console.log(roomdata);
        setRoom(roomdata);
        setBookingDetails({
          ...bookingDetails,
          roomNumber: roomdata.roomNumber,
          roomType: roomdata.roomType,
          roomPrice: roomdata.price
        });
      })
      .catch(err => console.log(err));
  }, [roomId]);

  if (!room) {
    return <div>Room not found</div>;
  }

  const discountedPrice = room?.price - (room?.price * room?.discount / 100);

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({
      ...bookingDetails,
      [name]: value
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Handle the booking form submission logic here
    console.log('Booking Details:', bookingDetails);
    // You can send bookingDetails to your backend API
    let bookingData = {
      ...bookingDetails,
      bookingid: uuidv4(),
      roomid: room.roomid,
      propertyAgent: room.propertyAgent,
      customerName: auth?.auth.payload.name,
      customerEmail: auth?.auth.payload.email
    }
    postBookingData(bookingData)
    .then(data => {
      console.log(data)
      setBookingDetails({
        roomNumber: '',
        roomType: '',
        roomPrice: '',
        startDate: '',
        endDate: '',
        message: ''
      });
      
    })
    .catch(err => console.log(err))
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-5">
        <h2 className="text-2xl font-bold mb-5">Room {room?.roomNumber}</h2>
        <img src={room?.imageUrl} alt={`Room ${room?.roomNumber}`} className="mb-4 w-full" />
        <p className="text-gray-700 mb-4">Room Type: {room?.roomType}</p>
        <p className="text-gray-700 mb-4">Description: {room?.description}</p>
        <p className="text-gray-700 mb-4">
          Original Price: <span className="line-through">${room?.price}</span>
        </p>
        <p className="text-gray-700 mb-4">
          Discounted Price: <span className="text-green-500">${discountedPrice.toFixed(2)}</span> ({room?.discount}% off)
        </p>
        <p className="text-gray-700 mb-4">Availability: {room?.availability ? <span className="text-green-500">Available for Booking</span> : <span className="text-red-500">Not Available for Booking</span>}</p>
        <h3 className="text-xl font-bold mb-3">Features</h3>
        <ul className="list-disc list-inside mb-4">
          {room?.features?.length > 0 && room?.features.map((feature, index) => (
            <li key={index} className="text-gray-700">{feature}</li>
          ))}
        </ul>
        <h3 className="text-xl font-bold mb-3">Feedbacks</h3>
        <div className="bg-gray-200 p-3 rounded-lg mb-4">
          {room?.feedbacks?.length > 0 ? (
            room?.feedbacks.map((comment, index) => (
              <p key={index} className="text-gray-700 mb-2">
                <span className="font-bold">{comment?.customerName}:</span> {comment?.feedbackText} {comment?.date}
              </p>
            ))
          ) : (
            <p>No Feedbacks yet.</p>
          )}
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          {room.availability == true && (
              <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowBookingForm(true)}
              >
              Book Room
              </button>
          ) }
          
        </div>
      </div>

      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-5">Book Room {room?.roomNumber}</h2>
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={bookingDetails.roomNumber}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Room Type</label>
                <input
                  type="text"
                  name="roomType"
                  value={bookingDetails.roomType}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Room Price</label>
                <input
                  type="text"
                  name="roomPrice"
                  value={bookingDetails.roomPrice}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={bookingDetails.startDate}
                  onChange={handleBookingInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={bookingDetails.endDate}
                  onChange={handleBookingInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={bookingDetails.message}
                  onChange={handleBookingInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
