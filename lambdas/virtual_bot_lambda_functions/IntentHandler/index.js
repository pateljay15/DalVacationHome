const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

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
        const userRole = body.originalDetectIntentRequest.payload.userRole || 'guest';

        console.log(`Event body received from bot: ${JSON.stringify(body)}`);
        console.log(`Parameters passed by bot: ${JSON.stringify(parameters)}`);
        console.log(`Intent triggered: ${intentName}`);
        console.log(`User role: ${userRole}`); // Log the user role received

        let responseMessage;
        
        if (intentName === 'Booking Info Intent' && (userRole === 'user' || userRole === 'admin')) {
            const bookingId = parameters.BookingReferenceCode;
            console.log(`1. Booking ID passed from user: ${bookingId}`);

            responseMessage = await invokeLambda('FetchBookingDetails', { bookingId });

            console.log(`2. Room number: ${responseMessage.roomNumber}`);
            console.log(`3. Duration of stay: ${responseMessage.duration}`);
            console.log(`4. Message to user: ${responseMessage.fulfillmentText}`);
        } else if (intentName === 'Customer Support Request Intent' && (userRole === 'user' || userRole === 'admin')) {
            const issue = parameters.Issue || '';
            const bookingReferenceCode = parameters.BookingReferenceCode || '';
            responseMessage = await invokeLambda('HandoffSupportRequest', { Issue: issue, BookingReferenceCode: bookingReferenceCode });

            console.log(`Response from HandoffSupportRequest: ${responseMessage.fulfillmentText}`);
        } else if (intentName === 'Navigation Intent') {
            // Handle navigation intent
            responseMessage = { fulfillmentText: 'Navigation handled' };
        } else {
            console.log(`User does not have the necessary permissions for this request. User role: ${userRole}`);
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

function createResponse(fulfillmentText) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            fulfillmentText: fulfillmentText
        })
    };
}
