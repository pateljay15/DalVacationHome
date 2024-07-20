import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const bookingsTable = "Bookings";
const roomsTable = "Rooms";

export const handler = async (event, context) => {
  const apiUrl = 'https://us-central1-dalvacationhome-429314.cloudfunctions.net/extract-sentiment';
  
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Log the incoming event
    console.log('Event:', event);
    
    const requestJSON = JSON.parse(event.body);
    const payload = {
      text: requestJSON.feedbackText
    };

    // Log the payload to be sent to the sentiment analysis API
    console.log('Payload:', payload);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Log the response data from the sentiment analysis API
    console.log('Sentiment API Response:', data);

    const feedback = {
      feedbackid: requestJSON.feedbackid,
      customerName: requestJSON.customerName,
      customerEmail: requestJSON.customerEmail,
      feedbackText: requestJSON.feedbackText,
      sentimentScore: data.sentimentScore,
      sentimentMagnitude: data.sentimentMagnitude,
      date: new Date().toISOString(),
    };

    // Log the feedback object to be saved
    console.log('Feedback:', feedback);

    const result = await dynamo.send(
      new UpdateCommand({
        TableName: roomsTable,
        Key: { roomid: requestJSON.roomid },
        UpdateExpression: "SET feedbacks = list_append(if_not_exists(feedbacks, :empty_list), :feedback)",
        ExpressionAttributeValues: {
          ":feedback": [feedback],
          ":empty_list": [],
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    // Log the result of the first update
    console.log('Update Room Result:', result);

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

    // Log the result of the second update
    console.log('Update Booking Result:', resultUpdateFeedbackStatus);

    body = `Updated Room ${requestJSON.roomid} with new feedback`;
  } catch (err) {
    statusCode = 400;
    // Log the error for debugging
    console.error('Error:', err);
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
