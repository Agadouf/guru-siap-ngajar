import prisma from "../../config/prisma.js";

export const getAllLessons = async () => {
  return await prisma.lesson.findMany({
    include: {
      module: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getLessonById = async (id) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      module: true,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  return lesson;
};

export const createLesson = async (data) => {
  return await prisma.lesson.create({
    data: {
      title: data.title,
      description: data.description,
      moduleId: data.moduleId,
    },
  });
};

export const updateLesson = async (id, data) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
  });

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  return await prisma.lesson.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      moduleId: data.moduleId,
    },
  });
};

export const deleteLesson = async (id) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
  });

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  await prisma.lesson.delete({
    where: { id },
  });
};