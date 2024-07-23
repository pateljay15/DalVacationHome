const { PubSub } = require('@google-cloud/pubsub');
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

/**
 * Retrieve Google Cloud credentials from AWS Secrets Manager.
 *
 * Args:
 *   secretName (string): The name of the secret in AWS Secrets Manager.
 *
 * Returns:
 *   object: The parsed credentials object.
 *
 * Throws:
 *   Error: If there is an error retrieving the secret.
 */
async function getGoogleCloudCredentials(secretName) {
    try {
        const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        return JSON.parse(secret.SecretString);
    } catch (error) {
        console.error('Error retrieving secrets:', error.message);
        throw new Error('Error retrieving secrets');
    }
}

/**
 * Publish a message to a Google Cloud Pub/Sub topic.
 *
 * Args:
 *   topicNameOrId (string): The name or ID of the Pub/Sub topic.
 *   data (string): The message data to publish.
 *
 * Throws:
 *   Error: If there is an error publishing the message.
 */
async function publishMessage(topicNameOrId, data) {
    const dataBuffer = Buffer.from(data);
    const secretName = 'dalvachome-secrets'; 

    const credentials = await getGoogleCloudCredentials(secretName);

    // Log credentials to check their structure (remove in production)
    console.log('Retrieved credentials:', credentials);

    // Check if client_email and private_key exist
    if (!credentials.client_email || !credentials.private_key) {
        console.error('Missing client_email or private_key in credentials');
        throw new Error('Missing client_email or private_key in credentials');
    }

    // Create PubSub client with credentials
    const pubSubClient = new PubSub({
        projectId: credentials.project_id, // Use project_id from credentials
        credentials: {
            client_email: credentials.client_email,
            private_key: credentials.private_key.replace(/\\n/g, '\n')
        }
    });

    try {
        const messageId = await pubSubClient
            .topic(topicNameOrId)
            .publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);
        throw new Error('Error publishing message to Pub/Sub');
    }
}

/**
 * AWS Lambda handler function to process incoming events, fetch credentials, and publish messages to Google Cloud Pub/Sub.
 *
 * Args:
 *   event (object): The event object containing issue, booking reference code, and email.
 *
 * Returns:
 *   object: A response object with a fulfillment text.
 *
 * Throws:
 *   Error: If there is an error during message publication.
 */
exports.handler = async (event) => {
    let body;
    if (typeof event === 'string') {
        body = JSON.parse(event);
    } else {
        body = event; 
    }

    const issue = body.Issue;
    const bookingReferenceCode = body.BookingReferenceCode;
    const email = body.Email; // Retrieve email from the event body

    console.log(`Triggered by IntentHandler`);
    console.log(`Issue received: ${issue}`);
    console.log(`Booking Reference Code received: ${bookingReferenceCode}`);
    console.log(`Email received: ${email}`); // Log the received email

    const topicName = 'projects/thematic-answer-427612-g9/topics/ManageCustomerSupportRequest';
    const data = JSON.stringify({
        issue: issue,
        bookingReferenceCode: bookingReferenceCode,
        email: email // Include email in the data to be published
    });

    try {
        await publishMessage(topicName, data);
    } catch (error) {
        console.error(`Error publishing message: ${error.message}`);
        throw new Error('Error publishing message to Pub/Sub');
    }

    return {
        fulfillmentText: 'Your query has been submitted. A representative will contact you shortly.'
    };
};
