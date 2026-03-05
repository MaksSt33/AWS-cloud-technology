import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  // Handle API Gateway proxy integration where path parameters are used
  let id = event.id;
  
  if (event.pathParameters && event.pathParameters.id) {
    id = event.pathParameters.id;
  } else if (event.queryStringParameters && event.queryStringParameters.id) {
    id = event.queryStringParameters.id;
  }

  if (!id) {
    throw new Error("Missing required field: id");
  }

  try {
    const { Item } = await docClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: id }
      })
    );
    
    if (!Item) {
      throw new Error("Course not found");
    }

    return {
      id: Item.id,
      title: Item.title,
      watchHref: Item.watchHref,
      authorId: Item.authorId,
      length: Item.length,
      category: Item.category
    };
  } catch (err) {
    console.error("Error fetching course:", err);
    throw err;
  }
};