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