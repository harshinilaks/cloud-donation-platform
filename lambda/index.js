import { createDonation } from "./createDonation.js";
import { createDropZone, getAllDropZones } from "./createDropZone.js";

export const handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event, null, 2));

  try {
    // Extract path and method
    const path = event.rawPath || event.path;
    const method = event.requestContext?.http?.method || event.httpMethod;

    console.log("Method:", method);
    console.log("Path:", path);

    // Safe body parsing
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

    // Handle POST /donations
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

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Donation created successfully!",
          donation,
        }),
      };
    }

    // Handle POST /dropzones
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

    // Handle GET /dropzones
    if (method === "GET" && path.endsWith("/dropzones")) {
      const dropzones = await getAllDropZones();

      return {
        statusCode: 200,
        body: JSON.stringify({
          dropzones,
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
