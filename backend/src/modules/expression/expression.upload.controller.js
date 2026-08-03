import prisma from "../../config/prisma.js";

export const uploadVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video uploaded.",
      });
    }

    const expression = await prisma.expression.findUnique({
      where: { id },
    });

    if (!expression) {
      return res.status(404).json({
        success: false,
        message: "Expression not found.",
      });
    }

    const videoUrl = `/uploads/videos/${req.file.filename}`;

    const updated = await prisma.expression.update({
      where: { id },
      data: {
        videoUrl,
      },
    });

    res.json({
      success: true,
      message: "Video uploaded successfully.",
      data: updated,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};