import prisma from "../../config/prisma.js";

export const getDashboardStats = async () => {
  const modules = await prisma.module.count();

  const lessons = await prisma.lesson.count();

  const expressions = await prisma.expression.count();

  const videos = await prisma.expression.count({
    where: {
      NOT: {
        videoUrl: null,
      },
    },
  });

  return {
    modules,
    lessons,
    expressions,
    videos,
  };
};