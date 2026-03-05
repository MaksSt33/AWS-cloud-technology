import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  // Handle API Gateway proxy integration where body is a JSON string
  let body = event;
  if (event.body) {
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      console.error("Error parsing event body:", e);
    }
  }

  if (!body.title) {
    throw new Error("Missing required field: title");
  }

  const id = body.title.replace(/ /g, "-").toLowerCase();
  const item = {
    id,
    title: body.title,
    watchHref: `http://www.pluralsight.com/courses/${id}`,
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
    console.error("Error saving course:", err);
    throw err;
  }
};