import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = "us-east-2";
const BUCKET_NAME = "reliefdrop-donations-harshini";

const s3 = new S3Client({ region: REGION });

export async function uploadDonationFile({
  dropzoneId,
  donationId,
  fileName,
  fileContent,
}) {
  const key = `reliefdrop/${dropzoneId}/${donationId}/${fileName}`;

  const cmd = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
  });

  await s3.send(cmd);

  console.log("File uploaded to S3:", key);
  return key;
}
if (process.argv[2] === "test") {
    (async () => {
      const dropzoneId = "dz-test";
      const donationId = "don-test";
      const fileName = "hello.txt";
      const fileContent = Buffer.from("hi from me!");
  
      const key = await uploadDonationFile({
        dropzoneId,
        donationId,
        fileName,
        fileContent,
      });
  
      console.log("test upload completed. s3 Key:", key);
    })();
  }
//this function takes the dropzone ID, donation ID, filename, and file content
//and then subsequently uploads the file to: reliefdrop/<dropzoneId>/<donationId>/<filename>
//and then returns the s3 key path for storage in DynamoDB