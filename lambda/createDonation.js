import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { uploadDonationFile, getDownloadUrl } from "./s3upload.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = "us-east-2";
const TABLE_NAME = "ReliefDrop";

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

export async function createDonation({
  dropzoneId,
  donorName,
  donorNote,
  fileName,
  fileContent,
}) {
  const donationId = `don-${uuidv4()}`;

  const uploadedFileKey = await uploadDonationFile({
    dropzoneId,
    donationId,
    fileName,
    fileContent,
  });

  const item = {
    PK: `DONATION#${donationId}`,
    SK: dropzoneId,
    donationId,
    dropzoneId,
    donorName,
    donorNote,
    uploadedFileKey,
    timestamp: new Date().toISOString(),
  };

  const cmd = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });

  await ddb.send(cmd);

  console.log("Donation created:", item);

  // now we are making it so that we are actually returning the presigned URL!!
  const downloadUrl = await getDownloadUrl(uploadedFileKey);

  return {
    ...item,
    downloadUrl,
  };
}

import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function getDonationsForDropzone(dropzoneId) {
  const cmd = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "SK = :sk AND begins_with(PK, :prefix)",
    ExpressionAttributeValues: {
      ":sk": dropzoneId,
      ":prefix": "DONATION#",
    },
  });

  const result = await ddb.send(cmd);
  return result.Items;
}

