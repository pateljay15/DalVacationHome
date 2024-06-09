import React from "react";
import LandingPage from "../pages/LandingPage/LandingPage";
import Login from "../pages/UserManagement/Login";
import { Route, Routes } from "react-router-dom";

import Registration from "../pages/UserManagement/Registration";
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/user/login" element={<Login />} />
      <Route path="/user/registration" element={<Registration type="user" />} />
      <Route
        path="/partner/registration"
        element={<Registration type="partner" />}
      />
    </Routes>
  );
};
