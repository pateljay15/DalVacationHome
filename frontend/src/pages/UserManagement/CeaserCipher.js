import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyCeaserCipher } from "../../services/AuthenticationServices/AuthenticationServices";
import { ToastContainer, toast } from "react-toastify";
import { logEvent } from "../../services/EventLoggingService/EventLoggingService";

const CaesarCipher = () => {
  const navigate = useNavigate();
  const [cipherText, setCipherText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      verifyCeaserCipher({ email: location.state.username })
        .then((response) => {
          let body = JSON.parse(response.body);
          if (body.shiftKey !== null) {
            const original = generateRandomText(4); // Generate random 4-char text
            console.log("original", original);
            setOriginalText(original);
            const ciphered = applyCipher(original, parseInt(body.shiftKey));
            console.log("cipher", ciphered);
            setCipherText(ciphered);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [hasMounted, location.state.username]);

  // Function to generate random 4-char text
  function generateRandomText(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  // Function to apply Caesar cipher
  function applyCipher(text, shift) {
    return text
      .split("")
      .map((char) => {
        let shiftedChar = String.fromCharCode(
          ((char.charCodeAt(0) - 65 + shift) % 26) + 65
        );
        return shiftedChar;
      })
      .join("");
  }

  // Handle user submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.toUpperCase() === originalText) {
      // alert('Correct! Well done.');
      const authData = JSON.stringify(location.state);
      localStorage.setItem("auth", authData);
      window.dispatchEvent(new Event("storage")); // Trigger storage event
      toast.success("Successfull Authentication", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      logEvent(location.state.username, "ceaser cipher passed");
      navigate("/"); // or another appropriate route
    } else {
      toast.error("Ceaser Cipher multi-factor failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setError("Incorrect. Please try again.");
      logEvent(location.state.username, "ceaser cipher failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Caesar Cipher Challenge</h1>
      <p className="mb-4">
        Decipher the following code: <strong>{cipherText}</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Your Answer</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
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

export default CaesarCipher;
