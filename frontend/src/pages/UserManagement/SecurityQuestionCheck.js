import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  verifyCeaserCipher,
  verifySecurityQuestionCheck,
} from "../../services/AuthenticationServices/AuthenticationServices";
import { toast } from "react-toastify";
import { logEvent } from "../../services/EventLoggingService/EventLoggingService";

const SecurityQuestionCheck = () => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer) {
      setError("Please enter the Answer.");
      return;
    }

    let state = location.state;
    let data = {
      email: state.username,
    };

    verifySecurityQuestionCheck(data)
      .then(async (data) => {
        console.log(data);
        let body = JSON.parse(data.body);
        if (body.securityAnswer == answer) {
          console.log(data);
          toast.success("Security QnA Passed", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          await logEvent(state.username, "security question passed");
          navigate("/verifyceasercipher", {
            state: { username: state.username, auth: state.auth },
          });
        } else {
          toast.error("Wrong Answer inputed for Question", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .catch(async (err) => {
        toast.error("Wrong Answer inputed for Question", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(err);
        await logEvent(state.username, "security question failed");
      });
    // navigate("/verifyceasercipher", { state: { username: state.username, auth : state.auth } });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Answer Security Question</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">
            What is your mother's maiden name?
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            className="text-white"
            onClick={() => navigate("/")}
          >
            Home Page
          </button>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SecurityQuestionCheck;
