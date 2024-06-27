import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-10 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold">Welcome to Book Me !</h1>
      </div>
      
      <iframe width="350" height="430" allow="microphone;" src="https://console.dialogflow.com/api-client/demo/embedded/09dddef5-582f-4703-acd3-3f7ee1b45c11"></iframe>

    </div>
  );
}

export default LandingPage;
