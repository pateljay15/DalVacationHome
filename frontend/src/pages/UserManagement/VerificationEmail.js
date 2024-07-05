import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userpool from '../../config/cognitoconfig/userpool';
import { CognitoUser} from "amazon-cognito-identity-js"
import { toast } from 'react-toastify';

const VerificationEmail = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code) {
      setError('Please enter the verification code.');
      return;
    }
    let state = location.state
    let userData = {
        Username: state.username,
        Pool: userpool,
    };

    var cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          toast.error("Email Verifcation Failed. Plz check code", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
            return;
        }
	    // Simulate a verification process
        console.log("Verification code submitted:", result);
        toast.success("Email Verification Successfull", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
        navigate('/user/login'); // or any other route
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Enter Verification Code</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Verification Code</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
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
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerificationEmail;
