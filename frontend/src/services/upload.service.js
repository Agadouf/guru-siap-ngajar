import { upload } from "@vercel/blob/client";
import api from "./api";

export const uploadVideo = async (expressionId, file, onProgress) => {
  const blob = await upload(
    `videos/${expressionId}/${file.name}`,
    file,
    {
      access: "public",
      handleUploadUrl: `${api.defaults.baseURL}/expressions/${expressionId}/video`,
      onUploadProgress: (event) => {
        if (onProgress) {
          onProgress(event.percentage);
        }
      },
    }
  );

  return blob;
};