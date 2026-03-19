import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return response(400, { message: "Missing required field: id" });
  }

  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return response(400, { message: "Invalid JSON body" });
  }

  const item = {
    id,
    title: body.title,
    watchHref: body.watchHref,
    authorId: body.authorId,
    length: body.length,
    category: body.category,
  };

  try {
    await docClient.send(
      new PutCommand({ TableName: process.env.TABLE_NAME, Item: item })
    );

    return response(200, item);
  } catch (err) {
    console.error("Error updating course:", err);
    return response(500, { message: "Internal server error" });
  }
};