import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);


/**
 * AWS Lambda function to store login statistics in DynamoDB.
 *
 * This function is triggered by a Cognito user pool event and expects an event with the following format:
 * {
 *   "request": {
 *     "userAttributes": {
 *       "email": "string",
 *       "name": "string",
 *       "custom:role": "string"  // Role code: "0" for Registered Customer, "1" for Property Agent
 *     }
 *   }
 * }
 *
 * Args:
 *   event (object): The event object containing user attributes.
 *
 * Returns:
 *   object: The original event object.
 */
const handler = async (event) => {
  const email = event.request.userAttributes.email;
  const name = event.request.userAttributes.name;
  const roleCode = event.request.userAttributes["custom:role"];

  const role =
    roleCode === "0"
      ? "Registered Customer"
      : roleCode === "1"
      ? "Property Agent"
      : "Unknown Role";

  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toISOString().split("T")[1].split(".")[0];

  const params = {
    TableName: "LoginStatistics",
    Key: { email: email },
    UpdateExpression:
      "SET #name = :name, #role = :role, loghistory = list_append(if_not_exists(loghistory, :emptyList), :logEntry)",
    ExpressionAttributeNames: {
      "#name": "name",
      "#role": "role",
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":role": role,
      ":logEntry": [
        {
          action: "login",
          date: date,
          time: time,
        },
      ],
      ":emptyList": [],
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamo.send(new UpdateCommand(params));
    console.log("Login statistics stored successfully");
  } catch (error) {
    console.error("Error storing login statistics:", error);
  }

  return event;
};

export { handler };
