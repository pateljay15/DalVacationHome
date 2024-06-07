import React from 'react'
import LandingPage from '../pages/LandingPage/LandingPage'
import Login from '../pages/UserManagement/Login'
import { Route, Routes } from 'react-router-dom'

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/user/login" element={<Login />} />
    </Routes>
  )
}
