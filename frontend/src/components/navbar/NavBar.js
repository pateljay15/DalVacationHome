import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/AuthenticationServices/AuthenticationServices";

function NavBar() {
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const auth = localStorage.getItem("auth"); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
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
    <nav className="bg-gray-800 flex justify-between items-center p-5">
      <div className="navbar-brand">
        <a href="/" className="text-white text-2xl font-bold no-underline">
          DalVacationHome
        </a>
      </div>
      <div className="flex-grow"></div>
      <div className="navbar-links flex items-center">
        {auth == null ? (
          <>
            <div className="relative">
              <span
                className="text-white text-lg font-bold no-underline mx-3 cursor-pointer"
                onClick={handleSignup}
              >
                Signup
              </span>
              {showSignupOptions && (
                <div className="absolute top-full mt-2 bg-white shadow-lg rounded-lg py-2 w-48 z-10">
                  <button
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    onClick={handleUserRegistration}
                  >
                    User Signup
                  </button>
                  <button
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
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
                  ? "text-white text-lg font-bold no-underline mx-3 border-b-2 border-yellow-400"
                  : "text-white text-lg font-bold no-underline mx-3"
              }
              to="/user/login"
            >
              Login
            </NavLink>
          </>
        ) : (
          <span
            className="text-white text-lg font-bold no-underline mx-3 hover:text-yellow-400 cursor-pointer"
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
