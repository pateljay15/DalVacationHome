import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) {
      errors.length = "Password must be at least 8 characters long.";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.specialChar =
        "Password must contain at least one special character.";
    }
    if (!/\d/.test(password)) {
      errors.number = "Password must contain at least one number.";
    }
    if (!/[A-Z]/.test(password)) {
      errors.capital = "Password must contain at least one capital letter.";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordErrors = validatePassword(password);
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }
    console.log("Form submitted:", { email, password });
  };

  const getTitle = () => {
    return type === "user" ? "User Registration" : "Partner Registration";
  };

  const getAlternateRoute = () => {
    return type === "user" ? "/partner/registration" : "/user/registration";
  };

  const getAlternateText = () => {
    return type === "user" ? "Partner Signup" : "User Signup";
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{getTitle()}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.length && (
            <p className="text-red-500 text-sm">{errors.length}</p>
          )}
          {errors.specialChar && (
            <p className="text-red-500 text-sm">{errors.specialChar}</p>
          )}
          {errors.number && (
            <p className="text-red-500 text-sm">{errors.number}</p>
          )}
          {errors.capital && (
            <p className="text-red-500 text-sm">{errors.capital}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Re-enter Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/")}
          >
            Home Page
          </button>
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => navigate(getAlternateRoute())}
          >
            {getAlternateText()}
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/user/login")}
          >
            Already have an account? Log in
          </button>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Registration;
