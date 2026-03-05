import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const { Items = [] } = await docClient.send(
      new ScanCommand({ TableName: process.env.TABLE_NAME })
    );
    
    return Items.map(({ id, title, watchHref, authorId, length, category }) => ({
      id,
      title,
      watchHref,
      authorId,
      length,
      category
    }));
  } catch (err) {
    console.error("Error fetching courses:", err);
    throw err;
  }
};