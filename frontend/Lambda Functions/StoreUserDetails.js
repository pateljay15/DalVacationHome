const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(event);

  const { email, name, role, securityAnswer } = event;

  console.log("****");
  console.log("email", email);

  const params = {
    TableName: "Users",
    Item: {
      email: email,
      name: name,
      role: role,
      securityAnswer: securityAnswer,
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
