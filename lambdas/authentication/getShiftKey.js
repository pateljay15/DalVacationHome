const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * AWS Lambda function to retrieve the shift key for a user based on their email.
 *
 * This function expects an event with the following format:
 * {
 *   "email": "string"
 * }
 *
 * Args:
 *   event (object): The event object containing the email of the user.
 *
 * Returns:
 *   object: A response object with a status code and a body. The body contains either the shift key for the user,
 *           or an error message if the email is not provided, the user is not found, or an error occurs during retrieval.
 */
exports.handler = async (event) => {
  const { email } = event;

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email is required" }),
    };
  }

  const params = {
    TableName: "Users",
    Key: {
      email: email,
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ shiftKey: data.Item.shiftKey }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve user" }),
    };
  }
};
