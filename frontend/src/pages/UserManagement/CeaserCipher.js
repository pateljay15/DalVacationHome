import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CaesarCipher = () => {
  const navigate = useNavigate();
  const [cipherText, setCipherText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const shift = 3; // Caesar cipher shift
  const location = useLocation()
  // Effect to cipher text when the component mounts
  useEffect(() => {
    const original = generateRandomText(4); // Generate random 4-char text
    console.log(original)
    setOriginalText(original)
    const ciphered = applyCipher(original, shift);
    setCipherText(ciphered);
  }, []);

  // Function to generate random 4-char text
  function generateRandomText(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Function to apply Caesar cipher
  function applyCipher(text, shift) {
    return text.split('').map(char => {
      let shiftedChar = String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      return shiftedChar;
    }).join('');
  }

  // Handle user submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.toUpperCase() === originalText) {
      alert('Correct! Well done.');
      console.log(location.state)
      navigate('/home'); // or another appropriate route
    } else {
      setError('Incorrect. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Caesar Cipher Challenge</h1>
      <p className="mb-4">Decipher the following code: <strong>{cipherText}</strong></p>
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
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
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
