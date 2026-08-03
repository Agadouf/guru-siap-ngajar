import prisma from "../../config/prisma.js";

export const getAllExpressions = async () => {
  return await prisma.expression.findMany({
    include: {
      lesson: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getExpressionById = async (id) => {
  const expression = await prisma.expression.findUnique({
    where: { id },
    include: {
      lesson: true,
    },
  });

  if (!expression) {
    throw new Error("Expression not found.");
  }

  return expression;
};

export const createExpression = async (data) => {
  return await prisma.expression.create({
    data: {
      english: data.english,
      indonesian: data.indonesian,
      explanation: data.explanation,
      videoUrl: data.videoUrl,
      lessonId: data.lessonId,
    },
  });
};

export const updateExpression = async (id, data) => {
  const expression = await prisma.expression.findUnique({
    where: { id },
  });

  if (!expression) {
    throw new Error("Expression not found.");
  }

  return await prisma.expression.update({
    where: { id },
    data: {
      english: data.english,
      indonesian: data.indonesian,
      explanation: data.explanation,
      videoUrl: data.videoUrl,
      lessonId: data.lessonId,
    },
  });
};

export const deleteExpression = async (id) => {
  const expression = await prisma.expression.findUnique({
    where: { id },
  });

  if (!expression) {
    throw new Error("Expression not found.");
  }

  await prisma.expression.delete({
    where: { id },
  });
};