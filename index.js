import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({
    region: "us-east-2",
  });
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "ReliefDrop";

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

async function test() {
    const newDZ = await createDropZone({
      name: "Wildfire Relief",
      description: "Collecting tents and water bottles.",
      neededItems: [
        { name: "Water Bottles", quantityNeeded: 1000, quantityReceived: 0 },
        { name: "Tents", quantityNeeded: 100, quantityReceived: 0 },
      ],
    });
  
    console.log("Created DropZone:", newDZ);
  
    const allDZ = await getAllDropZones();
    console.log("All DropZones:", allDZ);
  }
  
  test();