exports.handler = async (event) => {
    try {
        let body;
        if (typeof event.body === 'string') {
            body = JSON.parse(event.body);
        } else {
            body = event.body; // Assuming API Gateway Lambda proxy integration
        }

        console.log('FetchBookingDetails Lambda triggered by IntentHandler');

        // Perform your booking details retrieval logic here
        const bookingId = body.bookingId; // Example parameter extraction
        const responseMessage = `Booking details for ID ${bookingId} fetched successfully.`;

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                fulfillmentText: responseMessage // Send the response message back to IntentHandler
            })
        };

        return response;
    } catch (error) {
        console.error('Error handling FetchBookingDetails event:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                fulfillmentText: 'There was an error processing your booking details request. Please try again later.'
            })
        };
    }
};
