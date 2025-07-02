import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { uploadDonationFile } from "./s3upload.js";
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
  return item;
}

if (process.argv[2] === "test") {
    (async () => {
      const dropzoneId = "dz-test";
      const donorName = "Harshini";
      const donorNote = "Brand new sleeping bags!";
      const fileName = "sleepingbags.txt";
      const fileContent = Buffer.from("These are high quality sleeping bags!");
  
      const donation = await createDonation({
        dropzoneId,
        donorName,
        donorNote,
        fileName,
        fileContent,
      });
  
      console.log(" Test donation created:", donation);
    })();
  }
  
