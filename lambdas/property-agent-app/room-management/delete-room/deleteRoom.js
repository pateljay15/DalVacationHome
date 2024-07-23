const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: "us-east-1" });

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Rooms";

/**
 * AWS Lambda function to delete a room and its associated image from S3.
 *
 * This function expects an event with the following format:
 * {
 *   "pathParameters": {
 *     "roomid": "string"
 *   }
 * }
 *
 * Args:
 *   event (object): The event object containing the path parameters.
 *   context (object): The context object (not used in this function).
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body. The body contains a success message
 *           or an error message if the deletion fails.
 */
exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Add CORS header
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    if (!event.pathParameters || !event.pathParameters.roomid) {
      throw new Error("Missing roomid path parameter");
    }

    const { roomid } = event.pathParameters;

    const { Item } = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: { roomid },
      })
    );

    if (!Item) {
      throw new Error("Room not found");
    }

    const fileName = Item.imageUrl.split("/").pop();

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "dalvacationhome-room-images",
        Key: fileName,
      })
    );

    await dynamo.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { roomid },
      })
    );

    body = `Deleted room ${roomid}`;
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
