import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

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
    await docClient.send(
      new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id },
      })
    );

    return response(200, { message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    return response(500, { message: "Internal server error" });
  }
};