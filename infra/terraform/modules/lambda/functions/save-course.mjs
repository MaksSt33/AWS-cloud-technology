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
  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return response(400, { message: "Invalid JSON body" });
  }

  if (!body.title) {
    return response(400, { message: "Missing required field: title" });
  }

  const id = body.title.replace(/ /g, "-").toLowerCase();
  const item = {
    id,
    title: body.title,
    watchHref: `http://www.pluralsight.com/courses/${id}`,
    authorId: body.authorId,
    length: body.length,
    category: body.category,
  };

  try {
    await docClient.send(
      new PutCommand({ TableName: process.env.TABLE_NAME, Item: item })
    );

    return response(201, item);
  } catch (err) {
    console.error("Error saving course:", err);
    return response(500, { message: "Internal server error" });
  }
};