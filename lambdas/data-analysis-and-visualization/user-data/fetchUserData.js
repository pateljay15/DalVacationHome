import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    // Fetch users
    const usersParams = {
      TableName: "Users",
    };
    const usersResult = await dynamo.send(new ScanCommand(usersParams));
    const users = usersResult.Items;

    // Fetch login statistics
    const loginStatsParams = {
      TableName: "LoginStatistics",
    };
    const loginStatsResult = await dynamo.send(
      new ScanCommand(loginStatsParams)
    );
    const loginStats = loginStatsResult.Items;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({ users, loginStats }),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify("Failed to fetch data."),
    };
  }
};
