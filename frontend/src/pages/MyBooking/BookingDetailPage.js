import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthenticationToken } from '../../services/AuthenticationServices/AuthenticationServices';


const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  
  const [booking, setBooking] = useState({})
  const [room, setRoom] = useState(null)
  const auth = getAuthenticationToken()

  useEffect(() => {
    fetch('https://fa7721ywbk.execute-api.us-east-1.amazonaws.com/bookbyid/' + bookingId, {
      method: "GET",
    })
    .then(data => data.json())
    .then(res => {
        setBooking(res)
        console.log(res)
        fetch("https://fa7721ywbk.execute-api.us-east-1.amazonaws.com/room/" + res.roomid)
        .then(data => data.json())
        .then(roomdata => {
            console.log(roomdata);
            setRoom(roomdata);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

  }, [bookingId])
  
  if (!booking) {
    return <div>Booking not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-xl mx-auto bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-5">Booking Details</h1>
        <p><strong>Booking Reference Number:</strong> {booking.bookingid}</p>
        <p><strong>Room Number:</strong> {booking.roomNumber}</p>
        <p><strong>Room Type:</strong> {booking.roomType}</p>
        <p><strong>Price:</strong> {booking.price}</p>
        {room != null && <p><strong>Features:</strong> {room?.features.join(', ')}</p>}
        <p><strong>Message:</strong> {booking.message}</p>
        <p><strong>Property Agent Email:</strong> {booking.propertyAgent}</p>
        <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
        <p><strong>End Date:</strong> {booking.endDate}</p>
        <button
          className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default BookingDetailPage;
