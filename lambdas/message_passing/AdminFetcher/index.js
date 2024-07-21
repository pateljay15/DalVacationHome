const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const params = {
        TableName: 'Users', // Ensure 'Users' is the correct table name
        FilterExpression: '#role = :role',
        ExpressionAttributeNames: {
            '#role': 'role',
        },
        ExpressionAttributeValues: {
            ':role': '1',
        },
    };

    try {
        console.log('Fetching admins with params:', params); // Log params used for DynamoDB query
        const data = await dynamoDb.scan(params).promise();
        const admins = data.Items;
        
        console.log('Fetched Admins:', admins); // Log fetched admins
        
        return {
            statusCode: 200,
            body: JSON.stringify(admins),
        };
    } catch (error) {
        console.error('Error fetching admins:', error); // Log error if any
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch admins' }),
        };
    }
};
