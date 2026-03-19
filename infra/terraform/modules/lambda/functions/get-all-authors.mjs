import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

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

export const handler = async () => {
  try {
    const { Items = [] } = await docClient.send(
      new ScanCommand({ TableName: process.env.TABLE_NAME })
    );

    return response(200, Items.map(({ id, firstName, lastName }) => ({ id, firstName, lastName })));
  } catch (err) {
    console.error("Error fetching authors:", err);
    return response(500, { message: "Internal server error" });
  }
};