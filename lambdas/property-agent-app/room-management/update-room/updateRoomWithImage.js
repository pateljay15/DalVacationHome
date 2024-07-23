const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const s3Client = new S3Client({ region: "us-east-1" });
const dynamoClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dynamoClient);

const tableName = "Rooms";

/**
 * AWS Lambda function to update a room's details in the DynamoDB "Rooms" table and optionally upload an image to S3.
 *
 * This function expects an event with the following format:
 * {
 *   "body": JSON.stringify({
 *     "roomid": "string",
 *     "roomNumber": "string",
 *     "price": "number",
 *     "discount": "number",
 *     "image": "base64String",
 *     "roomType": "string",
 *     "availability": "boolean",
 *     "description": "string",
 *     "features": "array",
 *     "feedbacks": "array",
 *     "propertyAgent": "string"
 *   })
 * }
 *
 * Args:
 *   event (object): The event object containing the body with room details.
 *   context (object): The context object (not used in this function).
 *
 * Returns:
 *   object: A response object with a status code, headers, and a body. The body contains the updated room details
 *           or an error message if the operation fails.
 */
exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2)); // Log the event object for debugging

  let statusCode = 200;
  let body = {};
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // Check if the body is undefined or empty
    if (!event.body) {
      throw new Error("Missing request body");
    }

    // Parse the JSON body
    const {
      roomid,
      roomNumber,
      price,
      discount,
      image,
      roomType,
      availability,
      description,
      features,
      feedbacks,
      propertyAgent,
    } = JSON.parse(event.body);

    if (!roomid) {
      throw new Error("Missing roomid in request body");
    }

    let imageUrl;

    if (image) {
      const buffer = Buffer.from(image, "base64");
      const fileName = `${uuidv4()}.jpg`;
      const uploadParams = {
        Bucket: "dalvacationhome-room-images",
        Key: fileName,
        Body: buffer,
        ContentType: "image/jpeg",
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      imageUrl = `https://dalvacationhome-room-images.s3.amazonaws.com/${fileName}`;
    } else {
      imageUrl = null;
    }

    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (roomNumber !== undefined) {
      updateExpressions.push("#rn = :r");
      expressionAttributeNames["#rn"] = "roomNumber";
      expressionAttributeValues[":r"] = roomNumber;
    }

    if (price !== undefined) {
      updateExpressions.push("#p = :p");
      expressionAttributeNames["#p"] = "price";
      expressionAttributeValues[":p"] = price;
    }

    if (discount !== undefined) {
      updateExpressions.push("#d = :d");
      expressionAttributeNames["#d"] = "discount";
      expressionAttributeValues[":d"] = discount;
    }

    if (imageUrl !== null) {
      updateExpressions.push("#i = :i");
      expressionAttributeNames["#i"] = "imageUrl";
      expressionAttributeValues[":i"] = imageUrl;
    }

    if (roomType !== undefined) {
      updateExpressions.push("#t = :t");
      expressionAttributeNames["#t"] = "roomType";
      expressionAttributeValues[":t"] = roomType;
    }

    if (availability !== undefined) {
      updateExpressions.push("#a = :a");
      expressionAttributeNames["#a"] = "availability";
      expressionAttributeValues[":a"] = availability;
    }

    if (description !== undefined) {
      updateExpressions.push("#des = :des");
      expressionAttributeNames["#des"] = "description";
      expressionAttributeValues[":des"] = description;
    }

    if (features !== undefined) {
      updateExpressions.push("#f = :f");
      expressionAttributeNames["#f"] = "features";
      expressionAttributeValues[":f"] = features;
    }

    if (feedbacks !== undefined) {
      updateExpressions.push("#fb = :fb");
      expressionAttributeNames["#fb"] = "feedbacks";
      expressionAttributeValues[":fb"] = feedbacks;
    }

    if (propertyAgent !== undefined) {
      updateExpressions.push("#pa = :pa");
      expressionAttributeNames["#pa"] = "propertyAgent";
      expressionAttributeValues[":pa"] = propertyAgent;
    }

    const params = {
      TableName: tableName,
      Key: { roomid },
      UpdateExpression: "set " + updateExpressions.join(", "),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamo.send(new UpdateCommand(params));
    body = result.Attributes;
  } catch (err) {
    statusCode = 400;
    body = { error: err.message };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
    headers,
  };
};
