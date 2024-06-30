import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Bookings";

export const handler = async (event, context) => {
  let body;
  let fetchBookings;
  let resBookings;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    
    const fetchBookings = await client.send(new QueryCommand({
      TableName: tableName,
      IndexName: "customerEmail-index",
      KeyConditionExpression: "customerEmail = :customerEmail",
      ExpressionAttributeValues: {
        ":customerEmail":event.pathParameters.key
      }
    }));
    
    resBookings = fetchBookings.Items;
    
    if (!resBookings) {
      throw new Error("User does not exist!")    
    } 
    
    body = resBookings
    
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};