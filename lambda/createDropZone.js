import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const REGION = "us-east-2";
const TABLE_NAME = "ReliefDrop";

const client = new DynamoDBClient({
  region: REGION,
});
const ddb = DynamoDBDocumentClient.from(client);

export async function createDropZone({
  name,
  description,
  neededItems,
}) {
  const dropzoneId = `dz-${uuidv4()}`;
  const item = {
    PK: `DROPZONE#${dropzoneId}`,
    SK: "METADATA",
    dropzoneId,
    name,
    description,
    createdAt: new Date().toISOString(),
    neededItems,
  };

  const cmd = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });

  await ddb.send(cmd);

  console.log("DropZone created:", item);
  return item;
}

export async function getAllDropZones() {
  const cmd = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "begins_with(PK, :prefix)",
    ExpressionAttributeValues: {
      ":prefix": "DROPZONE#",
    },
  });

  const result = await ddb.send(cmd);
  console.log("DropZones:", result.Items);
  return result.Items;
}