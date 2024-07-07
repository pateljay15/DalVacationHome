import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import FeedbackModal from '../../components/MyBooking/FeedbackModal';  // Import the FeedbackModal component
import { getAuthenticationToken } from '../../services/AuthenticationServices/AuthenticationServices';
import { postFeedbackForRoom } from '../../services/BookingServices/BookingServices';
import { toast } from 'react-toastify';


function MyBookingPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [bookings, setBookings] = useState([])
  const [currentBooking, setCurrentBooking] = useState(null)
  const auth = getAuthenticationToken()

  useEffect(() => {
    fetch('https://fa7721ywbk.execute-api.us-east-1.amazonaws.com/book/' + auth?.auth.payload.email, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json"
      },
    })
    .then(data => data.json())
    .then(res => setBookings(res))
    .catch(err => console.log(err));
  }, [])

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  const handleFeedbackSubmit = (feedback) => {
    let feedbackData = {
      feedbackid: uuidv4(),
      roomid: currentBooking.roomid,
      bookingid: currentBooking.bookingid,
      feedbackText: feedback,
      customerName: auth?.auth.payload.name,
      customerEmail: auth?.auth.payload.email
    }

    postFeedbackForRoom(feedbackData)
    .then(res => {
      toast.success("Feedback Received", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      console.log(res)
      setCurrentBooking(null)
    })
    .catch(err => {
      toast.error("Feedback failed", {
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

  const isFeedbackEnabled = (endDate) => {
    const currentDate = new Date();
    const bookingEndDate = new Date(endDate);
    return currentDate > bookingEndDate;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-10 flex items-center justify-center p-5">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <FeedbackModal handleFeedbackSubmit={handleFeedbackSubmit} />
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
      <h1 className="text-3xl font-bold mb-5">My Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bookings.map((booking) => (
          <div key={booking.bookingid} className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Room {booking.roomNumber}</h2>
            <p className="text-gray-700 mb-1">Type: {booking.roomType}</p>
            <p className="text-gray-700 mb-1">Price: {booking.price}</p>
            <p className="text-gray-700 mb-1">Booking Date: {booking.startDate}</p>
            <p className="text-gray-700 mb-1">End Date: {booking.endDate}</p>
            <button
              className="mt-3 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleViewDetails(booking.bookingid)}
            >
              View Booking Details
            </button>
            {booking.feedbackRecived == false ? (
              <>
                {isFeedbackEnabled(booking.endDate) && (
              <>
              <p className="mt-3 w-full bg-green-100 text-green-700 text-center py-2 px-4 rounded">
                Hope you enjoyed your stay!
              </p>
              <button
                className="mt-3 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setCurrentBooking(booking)
                  setShowForm(!showForm)
                }}
              >
                Provide Feedback
              </button>
              </>
            )}
              </>
            ) : (
              <>
                <p className="mt-3 w-full bg-green-100 text-green-700 text-center py-2 px-4 rounded">
                  Thanks for the Feedback! Your Feedback means a lot.
                </p>
              </>
            ) }
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookingPage;