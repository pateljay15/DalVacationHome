const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
    try {
        let body;
        if (typeof event.body === 'string') {
            body = JSON.parse(event.body);
        } else {
            body = event.body; // Assuming API Gateway Lambda proxy integration
        }

        const intentDisplayName = body.queryResult.intent.displayName;

        console.log(`IntentHandler Lambda triggered by API with intent: ${intentDisplayName}`);

        let responseMessage;
        
        switch (intentDisplayName) {
            case 'Booking Info Intent':
                responseMessage = await invokeLambda('FetchBookingDetails', body.queryResult.parameters);
                break;
            case 'Customer Support Request Intent':
                responseMessage = handleCustomerSupportRequestIntent(body.queryResult.parameters);
                break;
            default:
                responseMessage = 'Sorry, I did not understand that request.';
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                fulfillmentText: responseMessage // Pass the response message to Dialogflow
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
        return responsePayload.fulfillmentText; // Return the fulfillmentText from FetchBookingDetails
    } catch (error) {
        console.error(`Error invoking ${functionName} Lambda:`, error);
        return 'There was an error processing your request. Please try again later.';
    }
}

function handleCustomerSupportRequestIntent(parameters) {
    const issueDescription = parameters.IssueDescription;
    console.log("Customer Support Request Intent");
    return `We have received your request regarding: ${issueDescription}. Our support team will contact you shortly.`;
}
