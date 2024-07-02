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
