const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const bookingReference = event.queryResult.parameters.bookingReference;

    const params = {
        TableName: 'Bookings',
        Key: {
            'bookingReference': bookingReference
        }
    };

    try {
        const data = await dynamoDB.get(params).promise();
        if (data.Item) {
            const response = {
                fulfillmentText: `Booking found: Room number ${data.Item.roomNumber}, check-in date ${data.Item.checkinDate}, duration of stay ${data.Item.durationOfStay} days.`
            };
            return response;
        } else {
            return {
                fulfillmentText: 'Booking reference not found.'
            };
        }
    } catch (error) {
        console.error(error);
        return {
            fulfillmentText: 'An error occurred while fetching the booking details.'
        };
    }
};
