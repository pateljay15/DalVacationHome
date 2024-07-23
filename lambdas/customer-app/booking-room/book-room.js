import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const bookingsTable = "Bookings";
const roomsTable = "Rooms";

/**
 * AWS Lambda function to create a booking and update room availability.
 *
 * This function expects an event with the following format:
 * {
 *   "body": JSON.stringify({
 *     "bookingid": "string",
 *     "roomid": "string",
 *     "roomNumber": "string",
 *     "roomPrice": "number",
 *     "roomType": "string",
 *     "propertyAgent": "string",
 *     "startDate": "string",
 *     "endDate": "string",
 *     "message": "string",
 *     "customerName": "string",
 *     "customerEmail": "string"
 *   })
 * }
 *
 * Args:
 *   event (object): The event object containing the body with booking and room details.
 *   context (object): The context object (not used in this function).
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body. The body contains a success message
 *           or an error message if the booking creation or room update fails.
 */
export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const requestJSON = JSON.parse(event.body);

    // Put a new item into the Bookings table
    await dynamo.send(
      new PutCommand({
        TableName: bookingsTable,
        Item: {
          bookingid: requestJSON.bookingid,
          roomid: requestJSON.roomid,
          roomNumber: requestJSON.roomNumber,
          price: requestJSON.roomPrice,
          roomType: requestJSON.roomType,
          propertyAgent: requestJSON.propertyAgent,
          startDate: requestJSON.startDate,
          endDate: requestJSON.endDate,
          message: requestJSON.message,
          customerName: requestJSON.customerName,
          customerEmail: requestJSON.customerEmail,
        },
      })
    );

    // Update the availability of the room in the Rooms table
    const result = await dynamo.send(
      new UpdateCommand({
        TableName: roomsTable,
        Key: { roomid: requestJSON.roomid }, // Assuming roomid is the primary key
        UpdateExpression: "set availability = :availability",
        ExpressionAttributeValues: {
          ":availability": false,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    body = `Put Booking ${requestJSON.bookingid} and updated Room ${requestJSON.roomid}`;
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
