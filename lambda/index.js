import { createDonation } from "./createDonation.js";
import { createDropZone, getAllDropZones } from "./createDropZone.js";

export const handler = async (event) => {
  console.log("Incoming event:", event);

  try {
    // routing based on HTTP path -> handles POST /donations, POST /dropzones, 
    const path = event.rawPath || event.path;
    const method = event.requestContext?.http?.method || event.httpMethod;

    if (method === "POST" && path === "/donations") {
      const body = JSON.parse(event.body);

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

    if (method === "POST" && path === "/dropzones") {
      const body = JSON.parse(event.body);

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

    if (method === "GET" && path === "/dropzones") {
      const dropzones = await getAllDropZones();

      return {
        statusCode: 200,
        body: JSON.stringify({
          dropzones,
        }),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Not Found",
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Server Error",
        error: err.message,
      }),
    };
  }
};
