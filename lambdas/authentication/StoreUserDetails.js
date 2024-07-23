const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

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

    // SNS Publish with specific format
    const message = {
      to: email, // Use the user's email as the destination for the notification
      subject: "Welcome to Our Service!",
      body: `Hi ${name}, welcome to our service! Your role is ${
        role == 0 ? "Customer" : "Property agent"
      }.`,
    };

    const publishParams = {
      Message: JSON.stringify(message),
      TopicArn: "arn:aws:sns:us-east-1:843898296640:userNotification",
    };
    await sns.publish(publishParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User registered successfully and notification sent.",
      }),
    };
  } catch (error) {
    console.log("Error in DynamoDB operation or SNS publish:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not register user or send notification",
      }),
    };
  }
};
