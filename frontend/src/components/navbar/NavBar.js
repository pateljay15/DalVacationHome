import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function NavBar() {
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const auth = localStorage.getItem("authToken"); // Example of fetching an auth token
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Example of removing an auth token
    navigate("/signup");
  };

  const handleSignup = () => {
    setShowSignupOptions(!showSignupOptions);
  };

  const handleUserRegistration = () => {
    navigate("/user/registration");
    setShowSignupOptions(false);
  };

  const handlePartnerRegistration = () => {
    navigate("/partner/registration");
    setShowSignupOptions(false);
  };

  return (
    <nav className="bg-gray-800 flex justify-between items-center p-5">
      <div className="navbar-brand">
        <a href="/" className="text-white text-2xl font-bold no-underline">
          bookRoom!
        </a>
      </div>
      <div className="navbar-links flex justify-center flex-grow">
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
                    onClick={handlePartnerRegistration}
                  >
                    Partner Signup
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
