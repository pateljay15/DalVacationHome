import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  let body;

  if (typeof event.body === "string") {
    body = JSON.parse(event.body);
  } else {
    body = event.body;
  }

  const { email, date, time, action } = body;

  const params = {
    TableName: "LoginStatistics",
    Key: { email: email },
    UpdateExpression:
      "SET loghistory = list_append(if_not_exists(loghistory, :emptyList), :logEntry)",
    ExpressionAttributeValues: {
      ":logEntry": [{ date: date, time: time, action: action }],
      ":emptyList": [],
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamo.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error("Error storing login statistics:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify("Failed to store login statistics."),
    };
  }
};
