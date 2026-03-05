import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  // Handle API Gateway proxy integration
  let id = event.id;
  
  if (event.pathParameters && event.pathParameters.id) {
    id = event.pathParameters.id;
  } else if (event.queryStringParameters && event.queryStringParameters.id) {
    id = event.queryStringParameters.id;
  } else if (event.body) {
    try {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      id = body.id || id;
    } catch (e) {
      console.error("Error parsing event body:", e);
    }
  }

  if (!id) {
    throw new Error("Missing required field: id");
  }

  try {
    await docClient.send(
      new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: id }
      })
    );
    return { message: "Course deleted successfully" };
  } catch (err) {
    console.error("Error deleting course:", err);
    throw err;
  }
};