const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * AWS Lambda function to register a new user by storing their details in DynamoDB.
 *
 * This function expects an event with the following format:
 * {
 *   "email": "string",
 *   "name": "string",
 *   "role": "string",
 *   "securityAnswer": "string",
 *   "shiftKey": "string"
 * }
 *
 * Args:
 *   event (object): The event object containing user details.
 *
 * Returns:
 *   object: A response object with a status code and a body. The body contains a success message if the user is registered successfully,
 *           or an error message if any required fields are missing or an error occurs during registration.
 */
exports.handler = async (event) => {
  const { email, name, role, securityAnswer, shiftKey } = event;

  if (!email || !name || !role || !securityAnswer || !shiftKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" }),
    };
  }

  const params = {
    TableName: "Users",
    Item: {
      email: email,
      name: name,
      role: role,
      securityAnswer: securityAnswer,
      shiftKey: shiftKey,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User registered successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not register user" }),
    };
  }
};
