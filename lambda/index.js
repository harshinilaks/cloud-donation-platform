import { createDonation, getDonationsForDropzone } from "./createDonation.js";
import { createDropZone, getAllDropZones } from "./createDropZone.js";
import { getDownloadUrl } from "./s3upload.js";

export const handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event, null, 2));

  try {
    let path = event.rawPath || event.path;
    const method = event.requestContext?.http?.method || event.httpMethod;

    console.log("RAW PATH:", path);
    console.log("Method:", method);

    if (path.startsWith("/dev")) {
      path = path.replace("/dev", "");
    }

    console.log("STRIPPED PATH:", path);

    let body;
    if (typeof event.body === "string") {
      try {
        body = JSON.parse(event.body);
      } catch (err) {
        console.error("Error parsing body:", err);
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Invalid JSON in request body",
          }),
        };
      }
    } else {
      body = event.body;
    }

    // POST /donations
    if (method === "POST" && path.endsWith("/donations")) {
      console.log("Parsed body:", body);

      const {
        dropzoneId,
        donorName,
        donorNote,
        fileName,
        fileContentBase64,
      } = body;

      const fileContent = Buffer.from(fileContentBase64, "base64");

      const donation = await createDonation({
        dropzoneId,
        donorName,
        donorNote,
        fileName,
        fileContent,
      });

      const downloadUrl = await getDownloadUrl(donation.uploadedFileKey);
      donation.downloadUrl = downloadUrl;

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Donation created successfully!",
          donation,
        }),
      };
    }

    // POST /dropzones
    if (method === "POST" && path.endsWith("/dropzones")) {
      console.log("Parsed body:", body);

      const { name, description, neededItems } = body;

      const dropzone = await createDropZone({
        name,
        description,
        neededItems,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Drop zone created successfully!",
          dropzone,
        }),
      };
    }

    // GET /dropzones
    if (method === "GET" && path === "/dropzones") {
      const dropzones = await getAllDropZones();

      return {
        statusCode: 200,
        body: JSON.stringify({
          dropzones,
        }),
      };
    }

    // GET /dropzones/{dropzoneId}/donations
    if (
      method === "GET" &&
      path.match(/^\/dropzones\/[^/]+\/donations$/)
    ) {
      const segments = path.split("/");
      const dropzoneId = segments[2];
      console.log("Fetching donations for dropzoneId:", dropzoneId);

      const donations = await getDonationsForDropzone(dropzoneId);

      // Generate download URLs for each donation
      for (const donation of donations) {
        donation.downloadUrl = await getDownloadUrl(donation.uploadedFileKey);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          donations,
        }),
      };
    }

    // Catch-all for unmatched routes
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Not Found",
      }),
    };
  } catch (err) {
    console.error("Unhandled error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Server Error",
        error: err.message,
      }),
    };
  }
};
