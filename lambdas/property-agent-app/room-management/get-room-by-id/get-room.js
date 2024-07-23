import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Rooms";

/**
 * AWS Lambda function to retrieve a specific room based on its room ID from the DynamoDB "Rooms" table.
 *
 * This function expects an event with the following format:
 * {
 *   "pathParameters": {
 *     "key": "string"  // Room ID
 *   }
 * }
 *
 * Args:
 *   event (object): The event object containing the path parameters.
 *   context (object): The context object (not used in this function).
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body. The body contains the room details
 *           or an error message if the room does not exist or the data fetch fails.
 */
export const handler = async (event, context) => {
  let body;
  let fetchRoom;
  let resRoom;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const fetchRoom = await client.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "roomid = :roomid",
      ExpressionAttributeValues: {
        ":roomid":event.pathParameters.key
      }
    }));
    
    resRoom = fetchRoom.Items[0];
    
    if (!resRoom) {
      throw new Error("Room does not exist!")    
    } 
    body = resRoom
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