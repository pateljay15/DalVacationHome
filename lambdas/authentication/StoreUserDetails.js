const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

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
