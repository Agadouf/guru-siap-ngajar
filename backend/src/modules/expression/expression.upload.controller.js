import { handleUpload } from "@vercel/blob/client";
import prisma from "../../config/prisma.js";

export const uploadVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const expression = await prisma.expression.findUnique({
      where: { id },
    });

    if (!expression) {
      return res.status(404).json({
        success: false,
        message: "Expression not found.",
      });
    }

    // This must be the JSON body sent by @vercel/blob/client
    const body = req.body;

    console.log("BLOB BODY:", JSON.stringify(body));

    if (!body || !body.type) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vercel Blob upload request body.",
      });
    }

    const jsonResponse = await handleUpload({
      body,
      request: req,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload,
        multipart
      ) => {
        return {
          allowedContentTypes: [
            "video/mp4",
            "video/webm",
            "video/ogg",
          ],

          addRandomSuffix: true,

          multipart,

          tokenPayload: JSON.stringify({
            expressionId: id,
            clientPayload,
          }),
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload);

        await prisma.expression.update({
          where: {
            id: payload.expressionId,
          },
          data: {
            videoUrl: blob.url,
          },
        });
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Video upload error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};