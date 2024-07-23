import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Bookings";

/**
 * AWS Lambda function to retrieve a booking based on its booking ID.
 *
 * This function expects an event with the following format:
 * {
 *   "pathParameters": {
 *     "key": "string"  // Booking ID
 *   }
 * }
 *
 * Args:
 *   event (object): The event object containing the path parameters.
 *   context (object): The context object (not used in this function).
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body. The body contains the booking details
 *           or an error message if the booking does not exist or an error occurs during retrieval.
 */
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
      KeyConditionExpression: "bookingid = :bookingid",
      ExpressionAttributeValues: {
        ":bookingid":event.pathParameters.key
      }
    }));
    
    resBookings = fetchBookings.Items[0];
    
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