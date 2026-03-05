import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  // Handle API Gateway proxy integration
  let body = event;
  if (event.body) {
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      console.error("Error parsing event body:", e);
    }
  }

  let id = body.id;
  if (event.pathParameters && event.pathParameters.id) {
    id = event.pathParameters.id;
  }

  if (!id) {
    throw new Error("Missing required field: id");
  }

  const item = {
    id: id,
    title: body.title,
    watchHref: body.watchHref,
    authorId: body.authorId,
    length: body.length,
    category: body.category
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: item
      })
    );
    
    return item;
  } catch (err) {
    console.error("Error updating course:", err);
    throw err;
  }
};