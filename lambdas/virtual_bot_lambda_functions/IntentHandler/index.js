const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

/**
 * AWS Lambda handler function to process incoming events from a chatbot and invoke other Lambda functions based on intent.
 *
 * This function expects an event with the following format:
 * {
 *   "body": {
 *     "queryResult": {
 *       "parameters": {
 *         "Email": "string",
 *         "BookingReferenceCode": "string",
 *         "Issue": "string"
 *       },
 *       "intent": {
 *         "displayName": "string"
 *       }
 *     },
 *     "originalDetectIntentRequest": {
 *       "payload": {
 *         "data": {
 *           "userRole": "string"
 *         }
 *       }
 *     }
 *   }
 * }
 *
 * Args:
 *   event (object): The event object containing the body with intent and parameters.
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body. The body contains the fulfillment text
 *           or an error message if the operation fails.
 */
exports.handler = async (event) => {
  try {
    let body;
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body);
    } else {
      body = event.body; 
    }

    const parameters = body.queryResult.parameters;
    const intentName = body.queryResult.intent.displayName;

    // Access token safely using optional chaining
    const token = body?.originalDetectIntentRequest?.payload?.data?.userRole;

    // Extract email from the event body
    const email = parameters.Email;

    console.log(`Event body received from bot: ${JSON.stringify(body)}`);
    console.log(`Parameters passed by bot: ${JSON.stringify(parameters)}`);
    console.log(`Intent triggered: ${intentName}`);
    console.log(`User role: ${token}`);
    console.log(`Email received: ${email}`);

    let responseMessage;

    if (intentName === 'Booking Info Intent') {
      const bookingId = parameters.BookingReferenceCode;
      console.log(`1. Booking ID passed from user: ${bookingId}`);

      responseMessage = await invokeLambda('FetchBookingDetails', { bookingId });

      console.log(`2. Room number: ${responseMessage.roomNumber}`);
      console.log(`3. Duration of stay: ${responseMessage.duration}`);
      console.log(`4. Message to user: ${responseMessage.fulfillmentText}`);
    } else if (intentName === 'Customer Support Request Intent') {
      const issue = parameters.Issue || '';
      const bookingReferenceCode = parameters.BookingReferenceCode || '';

      // Include email in the payload sent to HandoffSupportRequest
      responseMessage = await invokeLambda('HandoffSupportRequest', {
        Issue: issue,
        BookingReferenceCode: bookingReferenceCode,
        Email: email // Pass email to the function
      });

      console.log(`Response from HandoffSupportRequest: ${responseMessage.fulfillmentText}`);
    } else {
      console.log(`User does not have the necessary permissions for this request. User role: ${token}`);
      responseMessage = { fulfillmentText: 'Sorry, you do not have the necessary permissions for this request.' };
    }

    return createResponse(responseMessage.fulfillmentText);
  } catch (error) {
    console.error('Error handling the event:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        fulfillmentText: 'There was an error processing your request. Please try again later.'
      })
    };
  }
};

/**
 * Invoke another AWS Lambda function with the specified parameters.
 *
 * Args:
 *   functionName (string): The name of the Lambda function to invoke.
 *   parameters (object): The parameters to pass to the Lambda function.
 *
 * Returns:
 *   object: The response payload from the invoked Lambda function.
 *
 * Throws:
 *   Error: If there is an error invoking the Lambda function.
 */
async function invokeLambda(functionName, parameters) {
  const params = {
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(parameters)
  };

  try {
    const data = await lambda.invoke(params).promise();
    const responsePayload = JSON.parse(data.Payload);
    return responsePayload; 
  } catch (error) {
    console.error(`Error invoking ${functionName} Lambda:`, error);
    return {
      fulfillmentText: 'There was an error processing your request. Please try again later.'
    };
  }
}

/**
 * Create a response object with the specified fulfillment text.
 *
 * Args:
 *   fulfillmentText (string): The fulfillment text to include in the response.
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body containing the fulfillment text.
 */
function createResponse(fulfillmentText) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      fulfillmentText: fulfillmentText
    })
  };
}
