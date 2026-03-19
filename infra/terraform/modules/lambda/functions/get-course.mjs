import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

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

  try {
    const { Item } = await docClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id },
      })
    );

    if (!Item) {
      return response(404, { message: "Course not found" });
    }

    return response(200, {
      id: Item.id,
      title: Item.title,
      watchHref: Item.watchHref,
      authorId: Item.authorId,
      length: Item.length,
      category: Item.category,
    });
  } catch (err) {
    console.error("Error fetching course:", err);
    return response(500, { message: "Internal server error" });
  }
};