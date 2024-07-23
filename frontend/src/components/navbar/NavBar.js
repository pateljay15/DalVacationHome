import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getAuthenticationToken,
  logout,
} from "../../services/AuthenticationServices/AuthenticationServices";
import { toast } from "react-toastify";

function NavBar() {
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const auth = getAuthenticationToken();
  const role = auth?.auth?.payload["custom:role"];
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logout Successful", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    localStorage.removeItem("auth"); // Ensure auth is cleared
    navigate("/");
  };

  const handleSignup = () => {
    setShowSignupOptions(!showSignupOptions);
  };

  const handleUserRegistration = () => {
    navigate("/user/registration");
    setShowSignupOptions(false);
  };

  const handlePropertyAgentRegistration = () => {
    navigate("/propertyagent/registration");
    setShowSignupOptions(false);
  };

  return (
    <nav className="bg-gray-900 flex justify-between items-center p-5 shadow-lg">
      <div className="navbar-brand">
        <NavLink
          to="/"
          className="text-white text-2xl font-bold no-underline hover:text-yellow-400"
        >
          DalVacationHome
        </NavLink>
      </div>
      <div className="flex-grow flex justify-center items-center space-x-6">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-yellow-400 text-lg font-bold no-underline"
              : "text-white text-lg font-bold no-underline hover:text-yellow-400"
          }
          to="/"
        >
          Home
        </NavLink>
        {auth && role === "0" && (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 text-lg font-bold no-underline"
                : "text-white text-lg font-bold no-underline hover:text-yellow-400"
            }
            to="/mybookings"
          >
            MyBookings
          </NavLink>
        )}
        {auth && role === "1" && (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 text-lg font-bold no-underline"
                : "text-white text-lg font-bold no-underline hover:text-yellow-400"
            }
            to="/useranalytics"
          >
            User Analytics
          </NavLink>
        )}
        {auth && role === "0" && (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 text-lg font-bold no-underline"
                : "text-white text-lg font-bold no-underline hover:text-yellow-400"
            }
            to="/customerconcerns"
          >
            My Concerns
          </NavLink>
        )}
        {auth && role === "1" && (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 text-lg font-bold no-underline"
                : "text-white text-lg font-bold no-underline hover:text-yellow-400"
            }
            to="/agent/concerns"
          >
            Customer Concerns
          </NavLink>
        )}
      </div>
      <div className="navbar-links flex items-center space-x-6">
        {auth == null ? (
          <>
            <div className="relative">
              <span
                className="text-white text-lg font-bold no-underline cursor-pointer hover:text-yellow-400"
                onClick={handleSignup}
              >
                Signup
              </span>
              {showSignupOptions && (
                <div className="absolute top-full mt-2 bg-white shadow-lg rounded-lg w-32 z-10 py-1">
                  <button
                    className="block px-4 py-2 text-white w-full text-left mb-1"
                    onClick={handleUserRegistration}
                  >
                    User Signup
                  </button>
                  <button
                    className="block px-4 py-2 text-white w-full text-left"
                    onClick={handlePropertyAgentRegistration}
                  >
                    Property Agent Signup
                  </button>
                </div>
              )}
            </div>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 text-lg font-bold no-underline"
                  : "text-white text-lg font-bold no-underline hover:text-yellow-400"
              }
              to="/user/login"
            >
              Login
            </NavLink>
          </>
        ) : (
          <span
            className="text-white text-lg font-bold no-underline hover:text-yellow-400 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </span>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
