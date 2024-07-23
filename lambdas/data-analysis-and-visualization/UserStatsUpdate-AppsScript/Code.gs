/**
 * Fetch user data and login statistics from an API and populate Google Sheets with the data.
 *
 * This function performs the following steps:
 * 1. Fetches data from a specified API endpoint.
 * 2. Parses the JSON response.
 * 3. Opens a Google Spreadsheet by its ID.
 * 4. Clears any existing data in the "UserSheet" and "LogSheet" sheets.
 * 5. Populates the "UserSheet" with user data.
 * 6. Populates the "LogSheet" with login statistics data.
 */
function fetchUserData() {
  var url = 'https://auidgx4717.execute-api.us-east-1.amazonaws.com/dev/userStats';
  var options = {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
    }
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var data = JSON.parse(response.getContentText());

    var spreadsheet = SpreadsheetApp.openById('1-pS30QlzY6prK61XiJKkVR9Rx-X1MmH58KBPgFNzePQ');
    var userSheet = spreadsheet.getSheetByName('UserSheet');
    var logSheet = spreadsheet.getSheetByName('LogSheet');

    if (!userSheet) {
      userSheet = spreadsheet.insertSheet('UserSheet');
    }

    if (!logSheet) {
      logSheet = spreadsheet.insertSheet('LogSheet');
    }

    userSheet.clear();
    logSheet.clear();

    userSheet.appendRow(['Email', 'Name', 'Role', 'Security Answer', 'Shift Key']);
    logSheet.appendRow(['Email', 'Action', 'Date', 'Time']);

    var userData = [];
    var logData = [];

    data.users.forEach(function (user) {
      var role = user.role === '0' ? 'Registered Customer' : user.role === '1' ? 'Property Agent' : user.role;
      userData.push([user.email, user.name, role, user.securityAnswer, user.shiftKey]);
    });

    data.loginStats.forEach(function (logItem) {
      logItem.loghistory.forEach(function (log) {
        logData.push([logItem.email, log.action, log.date, log.time]);
      });
    });

    if (userData.length > 0) {
      userSheet.getRange(2, 1, userData.length, userData[0].length).setValues(userData);
    }

    if (logData.length > 0) {
      logSheet.getRange(2, 1, logData.length, logData[0].length).setValues(logData);
    }
  } catch (error) {
    Logger.log('Error: ' + error.message);
  }
}
