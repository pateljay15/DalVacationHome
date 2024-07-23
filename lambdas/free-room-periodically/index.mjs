import dynamodb from '@aws-sdk/client-dynamodb';
const { DynamoDBClient, ScanCommand, GetItemCommand } = dynamodb;
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const bookingsTable = "Bookings";
const roomsTable = "Rooms";

/**
 * AWS Lambda function to check bookings and update room availability based on the end date.
 *
 * This function scans the "Bookings" table, checks each booking's end date, and updates the corresponding room's availability
 * if the current date is greater than the booking's end date.
 *
 * Args:
 *   event (object): The event object (not used in this function).
 *   context (object): The context object (not used in this function).
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body. The body contains a success message
 *           or an error message if the process fails.
 */
export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Fetch all bookings from the Bookings table
    console.log("Fetching bookings from the Bookings table");
    const bookingsResult = await dynamo.send(
      new ScanCommand({
        TableName: bookingsTable,
      })
    );

    const currentDate = new Date();
    console.log("Current Date:", currentDate);

    // Loop through each booking and update the room availability if current date is greater than endDate
    const updatePromises = bookingsResult.Items.map(async (booking) => {
      try {
        console.log("Booking:", booking);

        if (!booking.endDate || !booking.endDate.S) {
          console.warn(`Skipping booking ${booking.bookingid && booking.bookingid.S} with missing endDate`);
          return;
        }

        const endDate = new Date(booking.endDate.S);
        console.log(`Booking ${booking.bookingid && booking.bookingid.S} End Date:`, endDate);

        // Check if the endDate is valid
        if (isNaN(endDate)) {
          console.warn(`Invalid endDate for booking ${booking.bookingid && booking.bookingid.S}: ${booking.endDate.S}`);
          return;
        }

        // Compare dates considering the format "YYYY-MM-DD"
        if (currentDate > endDate) {
          const roomId = booking.roomid && booking.roomid.S;

          // Check if the room exists
          const roomResult = await dynamo.send(
            new GetItemCommand({
              TableName: roomsTable,
              Key: { roomid: { S: roomId } },
            })
          );

          if (!roomResult.Item) {
            console.warn(`Room ${roomId} does not exist. Skipping update.`);
            return;
          }

          // Check if the room's availability is already true
          if (roomResult.Item.availability && roomResult.Item.availability.BOOL === true) {
            console.log(`Room ${roomId} is already available. Skipping update.`);
            return;
          }

          console.log(`Updating room ${roomId} to available`);
          await dynamo.send(
            new UpdateCommand({
              TableName: roomsTable,
              Key: { roomid: roomId }, // Assuming roomid is the primary key
              UpdateExpression: "set availability = :availability",
              ExpressionAttributeValues: {
                ":availability": true,
              },
              ReturnValues: "UPDATED_NEW",
            })
          );
        }
      } catch (innerError) {
        console.error(`Error processing booking ${booking.bookingid && booking.bookingid.S}:`, innerError);
      }
    });

    await Promise.all(updatePromises);

    body = `Checked and updated room availabilities.`;
  } catch (err) {
    statusCode = 400;
    body = err.message;
    console.error("Error:", err);
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
