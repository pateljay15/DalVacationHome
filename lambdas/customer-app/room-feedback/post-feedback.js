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

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const requestJSON = JSON.parse(event.body);

    // Extract feedback information from the request
    const feedback = {
      feedbackid: requestJSON.feedbackid,
      customerName: requestJSON.customerName,
      customerEmail: requestJSON.customerEmail,
      feedbackText: requestJSON.feedbackText,
      date: new Date().toISOString(),
    };

    // Append the feedback to the feedbacks array in the Rooms table
    const result = await dynamo.send(
      new UpdateCommand({
        TableName: roomsTable,
        Key: { roomid: requestJSON.roomid }, // Assuming roomid is the partition key
        UpdateExpression: "SET feedbacks = list_append(if_not_exists(feedbacks, :empty_list), :feedback)",
        ExpressionAttributeValues: {
          ":feedback": [feedback],
          ":empty_list": [],
        },
        ReturnValues: "UPDATED_NEW",
      })
    );
    
    const resultUpdateFeedbackStatus = await dynamo.send(
      new UpdateCommand({
        TableName: bookingsTable,
        Key: { bookingid: requestJSON.bookingid }, 
        UpdateExpression: "set feedbackRecived = :feedbackRecived",
        ExpressionAttributeValues: {
          ":feedbackRecived": true,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    body = `Updated Room ${requestJSON.roomid} with new feedback`;
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
