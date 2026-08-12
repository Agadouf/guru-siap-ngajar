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

    const body = req.body;

    if (!body || !body.type) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vercel Blob upload request.",
      });
    }

    const jsonResponse = await handleUpload({
      body,
      request: req,

      onBeforeGenerateToken: async (pathname, clientPayload) => {
       return {
  allowedContentTypes: [
    "video/mp4",
    "video/webm",
    "video/ogg",
  ],

  addRandomSuffix: true,

  callbackUrl:
    `https://guru-siap-ngajar-backend.vercel.app/api/expressions/${id}/video`,

  tokenPayload: JSON.stringify({
    expressionId: id,
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