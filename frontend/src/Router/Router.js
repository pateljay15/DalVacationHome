import React from "react";
import { Route, Routes } from "react-router-dom";
// import LandingPage from "../pages/LandingPage/LandingPage";
import Login from "../pages/UserManagement/Login";
import Registration from "../pages/UserManagement/Registration";
import Home from "../pages/Home/Home";
import VerificationEmail from "../pages/UserManagement/VerificationEmail";
import SecurityQuestionCheck from "../pages/UserManagement/SecurityQuestionCheck";
import CeaserCipher from "../pages/UserManagement/CeaserCipher";
import RoomDetail from "../components/roomgrid/RoomDetail";
import { roomsData } from "../components/roomgrid/dummydata";
import MyBookingPage from "../pages/MyBooking/MyBookingPage";
import BookingDetailPage from "../pages/MyBooking/BookingDetailPage";
import UserAnalytics from "../pages/User Analytics/UserAnalytics";
import CustomerConcerns from "../pages/CustomerConcerns/CustomerConcerns";
import ConcernChat from "../pages/CustomerConcerns/ConcernChat";
import AgentConcerns from "../pages/PropertyAgentConcerns/AgentConcerns";
import AgentConcernChat from "../pages/PropertyAgentConcerns/AgentConcernChat";

// const roomsData = [
//   { id: 1, roomNumber: "101", price: "$50", imageUrl: "https://en.idei.club/uploads/posts/2023-08/thumbs/1691227156_en-idei-club-p-simple-hotel-room-images-dizain-vkontakte-32.jpg", features: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"] },
//   { id: 2, roomNumber: "102", price: "$60", imageUrl: "https://en.idei.club/uploads/posts/2023-08/thumbs/1691227156_en-idei-club-p-simple-hotel-room-images-dizain-vkontakte-32.jpg", features: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"] },
//   { id: 3, roomNumber: "103", price: "$55", imageUrl: "https://en.idei.club/uploads/posts/2023-08/thumbs/1691227156_en-idei-club-p-simple-hotel-room-images-dizain-vkontakte-32.jpg", features: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"] },
//   // Add more rooms as needed
// ];

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user/login" element={<Login />} />
      <Route path="/user/registration" element={<Registration type="user" />} />
      <Route
        path="/propertyagent/registration"
        element={<Registration type="propertyagent" />}
      />
      <Route path="/verifyemail" element={<VerificationEmail />} />
      <Route path="/verifysecurityanswer" element={<SecurityQuestionCheck />} />
      <Route path="/verifyceasercipher" element={<CeaserCipher />} />
      <Route path="/rooms/:roomId" element={<RoomDetail />} />
      <Route path="/mybookings" element={<MyBookingPage />} />
      <Route path="/booking/:bookingId" element={<BookingDetailPage />} />
      <Route path="/useranalytics" element={<UserAnalytics />} />
      <Route path="/customerconcerns" element={<CustomerConcerns />} />
      <Route path="/concern/:concernId" element={<ConcernChat />} />
      <Route path="/agent/concerns" element={<AgentConcerns />} />
      <Route path="/agent/concern/:concernId" element={<AgentConcernChat />} />
    </Routes>
  );
};
