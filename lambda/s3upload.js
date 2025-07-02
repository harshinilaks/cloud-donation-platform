import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export async function getDownloadUrl(s3Key) {
  const cmd = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  const url = await getSignedUrl(s3, cmd, {
    expiresIn: 60 * 60 * 24, // 24 hours
  });

  return url;
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

    // TEST the download URL!
    const url = await getDownloadUrl(key);
    console.log("Download URL:", url);
  })();
}
