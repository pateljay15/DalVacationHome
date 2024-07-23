import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Rooms";

/**
 * AWS Lambda function to scan and retrieve all items from the "Rooms" DynamoDB table.
 *
 * This function does not expect any specific input in the event and will scan the entire
 * "Rooms" table to fetch the data.
 *
 * Args:
 *   event (object): The event object (not used in this function).
 *   context (object): The context object (not used in this function).
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body. The body contains the list of rooms
 *           or an error message if the data fetch fails.
 */
export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    body = await dynamo.send(
        new ScanCommand({ TableName: tableName })
      );
    
    body = body.Items;
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