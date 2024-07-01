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
        console.log(`Event body received from bot: ${JSON.stringify(body)}`);
        console.log(`Parameters passed by bot: ${JSON.stringify(parameters)}`);

        const bookingId = parameters.BookingReferenceCode;
        console.log(`1. Booking ID passed from user: ${bookingId}`);

        const responseMessage = await invokeLambda('FetchBookingDetails', { bookingId });

        console.log(`2. Room number: ${responseMessage.roomNumber}`);
        console.log(`3. Duration of stay: ${responseMessage.duration}`);
        console.log(`4. Message to user: ${responseMessage.fulfillmentText}`);

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                fulfillmentText: responseMessage.fulfillmentText
            })
        };

        return response;
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
