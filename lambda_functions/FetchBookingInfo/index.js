const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const parameters = event;
        const bookingId = parameters.bookingId;

        console.log(`1. Booking ID passed on by IntentHandler: ${bookingId}`);

        const bookingDetails = await fetchBookingDetails(bookingId);

        if (bookingDetails) {
            const roomNumber = bookingDetails.roomNumber;
            const startDate = new Date(bookingDetails.startDate);
            const endDate = new Date(bookingDetails.endDate);
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            console.log(`2. Booking found`);
            console.log(`3. Room number: ${roomNumber}`);
            console.log(`4. Duration of stay: ${duration} days`);

            const responseMessage = `Your room number is ${roomNumber}, and you are staying for ${duration} days.`;
            console.log(`5. Message to be returned to IntentHandler: ${responseMessage}`);

            return {
                roomNumber,
                duration,
                fulfillmentText: responseMessage
            };
        } else {
            const responseMessage = 'No such booking found.';
            console.log(`2. Booking ID not found`);
            console.log(`5. Message to be returned to IntentHandler: ${responseMessage}`);

            return {
                fulfillmentText: responseMessage
            };
        }
    } catch (error) {
        console.error('Error handling FetchBookingDetails event:', error);

        return {
            fulfillmentText: 'There was an error processing your booking details request. Please try again later.'
        };
    }
};

async function fetchBookingDetails(bookingId) {
    const params = {
        TableName: 'Bookings',
        Key: {
            bookingid: bookingId 
        }
    };

    try {
        const data = await docClient.get(params).promise();
        console.log(`Fetched data from DynamoDB: ${JSON.stringify(data)}`);
        return data.Item;
    } catch (error) {
        console.error('Error fetching booking details from DynamoDB:', error);
        return null;
    }
}
