import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { roomsData } from './dummydata';
import { postBookingData } from '../../services/BookingServices/BookingServices';
import { getAuthenticationToken } from '../../services/AuthenticationServices/AuthenticationServices';
import { toast } from 'react-toastify';

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const auth = getAuthenticationToken();
  const role = auth?.auth?.payload["custom:role"];
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
    fetch("https://fa7721ywbk.execute-api.us-east-1.amazonaws.com/room/" + roomId)
      .then(data => data.json())
      .then(roomdata => {
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

  function generateRandomId() {
    const prefix = "BH";
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return prefix + randomDigits;
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    let bookingData = {
      ...bookingDetails,
      bookingid: generateRandomId(),
      roomid: room.roomid,
      propertyAgent: room.propertyAgent,
      customerName: auth?.auth.payload.name,
      customerEmail: auth?.auth.payload.email
    };
    postBookingData(bookingData)
      .then(data => {
        toast.success("Booking Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setBookingDetails({
          roomNumber: '',
          roomType: '',
          roomPrice: '',
          startDate: '',
          endDate: '',
          message: ''
        });
      })
      .catch(err => {
        toast.error("Booking failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const getPolarity = (score) => {
    if (score > 0.6) return { text: "Clearly Positive", color: "bg-green-700 text-white" };
    if (score > 0.2 && score <= 0.6) return { text: "Slightly Positive", color: "bg-green-300 text-black" };
    if (score > 0.1 && score <= 0.2) return { text: "Neutral", color: "bg-yellow-200 text-black" };
    if (score === 0.0) return { text: "Mixed", color: "bg-gray-300 text-black" };
    if (score >= -0.6 && score < 0.0) return { text: "Slightly Negative", color: "bg-red-300 text-black" };
    return { text: "Clearly Negative", color: "bg-red-700 text-white" };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-10">
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
        <div className="overflow-x-auto">
          <table className="w-full mb-4 table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Feedback</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Score</th>
                <th className="border px-4 py-2">Magnitude</th>
                <th className="border px-4 py-2">Polarity</th>
              </tr>
            </thead>
            <tbody>
              {room?.feedbacks?.length > 0 ? (
                room?.feedbacks.map((comment, index) => {
                  const polarity = getPolarity(comment?.sentimentScore);
                  return (
                    <tr key={index} className={`${polarity.color}`}>
                      <td className="border px-4 py-2">{comment?.customerName}</td>
                      <td className="border px-4 py-2">{comment?.feedbackText}</td>
                      <td className="border px-4 py-2">{comment?.date}</td>
                      <td className="border px-4 py-2">{comment?.sentimentScore.toFixed(2)}</td>
                      <td className="border px-4 py-2">{comment?.sentimentMagnitude.toFixed(2)}</td>
                      <td className="border px-4 py-2">{polarity.text}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="border px-4 py-2 text-center">No Feedbacks yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          {room.availability && role == "0" && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowBookingForm(true)}
            >
              Book Room
            </button>
          )}
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
