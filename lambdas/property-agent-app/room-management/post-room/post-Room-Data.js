import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { S3Client,  PutObjectCommand} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: 'us-east-1' });


const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Rooms";

/**
 * AWS Lambda function to add a new room to the DynamoDB "Rooms" table and upload the room's image to S3.
 *
 * This function expects an event with the following format:
 * {
 *   "body": JSON.stringify({
 *     "roomid": "string",
 *     "roomNumber": "string",
 *     "price": "number",
 *     "discount": "number",
 *     "image": "base64String",
 *     "fileName": "string",
 *     "roomType": "string",
 *     "availability": "boolean",
 *     "description": "string",
 *     "features": "array",
 *     "comments": "array",
 *     "propertyAgent": "string"
 *   })
 * }
 *
 * Args:
 *   event (object): The event object containing the body with room details.
 *   context (object): The context object (not used in this function).
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body. The body contains a success message
 *           or an error message if the operation fails.
 */
export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    let requestJSON = JSON.parse(event.body);
    
    let base64Encoded = requestJSON.image;
    const buffer = Buffer.from(base64Encoded, 'base64');
    await s3Client.send( new PutObjectCommand(
        { 
          Bucket: "dalvacationhome-room-images", 
          Key: requestJSON.fileName, 
          Body: buffer 
        }
      ))
    
    
    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          roomid: requestJSON.roomid,
          roomNumber: requestJSON.roomNumber,
          price: requestJSON.price,
          discount: requestJSON.discount,
          imageUrl: "https://dalvacationhome-room-images.s3.amazonaws.com/"+requestJSON.fileName,
          roomType: requestJSON.roomType,
          availability: requestJSON.availability,
          description: requestJSON.description,
          features: requestJSON.features,
          comments: requestJSON.comments,
          propertyAgent: requestJSON.propertyAgent
        },
      })
    );

    body = `Put room ${requestJSON.roomid}`;
  } catch (err) {
    statusCode = 400;
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
