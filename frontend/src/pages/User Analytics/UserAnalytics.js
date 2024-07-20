import React, { useState } from 'react';

function UserAnalytics() {
  const [selectedStat, setSelectedStat] = useState('login');

  const handleChange = (event) => {
    setSelectedStat(event.target.value);
  };

  const getIframeSrc = () => {
    switch (selectedStat) {
      case 'login':
        return 'https://lookerstudio.google.com/embed/reporting/185e61f2-f895-4cd8-9fdf-9b6b22ebead6/page/uRN6D';
      case 'user':
        return 'https://lookerstudio.google.com/embed/reporting/8ce98888-fe36-4ea6-9003-b022b20df8cd/page/4bN6D';
    //   case 'other':
    //     return 'https://lookerstudio.google.com/embed/reporting/185e61f2-f895-4cd8-9fdf-9b6b22ebead6/page/uRN6D'; // Replace with actual URL for 'other' if available
      default:
        return 'https://lookerstudio.google.com/embed/reporting/185e61f2-f895-4cd8-9fdf-9b6b22ebead6/page/uRN6D';
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center p-4">
      <div className="mb-4 w-full max-w-md">
        <label htmlFor="stat-select" className="block text-lg font-medium text-gray-700 mb-2">
          Select Statistic
        </label>
        <select
          id="stat-select"
          value={selectedStat}
          onChange={handleChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="login">Login Statistic</option>
          <option value="user">User Statistic</option>
          {/* <option value="other">Other Stat</option> */}
        </select>
      </div>

      <div className="flex-grow flex justify-center items-center w-full">
        <iframe
          width="100%"
          height="100%"
          src={getIframeSrc()}
          frameBorder="0"
          className="border-0"
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          title="User Analytics"
        ></iframe>
      </div>
    </div>
  );
}

export default UserAnalytics;
