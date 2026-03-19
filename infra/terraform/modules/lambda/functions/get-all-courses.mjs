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

export const handler = async (event) => {
  // Demo hook: GET /courses?forceError=true  →  logs ERROR and returns 500
  if (event.queryStringParameters?.forceError === "true") {
    console.error("DEMO: forced error triggered via ?forceError=true");
    return response(500, { message: "Forced error for alarm demonstration" });
  }

  try {
    const { Items = [] } = await docClient.send(
      new ScanCommand({ TableName: process.env.TABLE_NAME })
    );

    return response(200, Items.map(({ id, title, watchHref, authorId, length, category }) => ({
      id, title, watchHref, authorId, length, category,
    })));
  } catch (err) {
    console.error("Error fetching courses:", err);
    return response(500, { message: "Internal server error" });
  }
};