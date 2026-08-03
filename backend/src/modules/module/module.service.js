import prisma from "../../config/prisma.js";

export const getAllModules = async () => {
  return await prisma.module.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getModuleById = async (id) => {
  const module = await prisma.module.findUnique({
    where: {
      id,
    },
  });

  if (!module) {
    throw new Error("Module not found.");
  }

  return module;
};

export const createModule = async (data) => {
  return await prisma.module.create({
    data: {
      title: data.title,
      description: data.description,
    },
  });
};

export const updateModule = async (id, data) => {
  const module = await prisma.module.findUnique({
    where: {
      id,
    },
  });

  if (!module) {
    throw new Error("Module not found.");
  }

  return await prisma.module.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      description: data.description,
    },
  });
};

export const deleteModule = async (id) => {
  const module = await prisma.module.findUnique({
    where: {
      id,
    },
  });

  if (!module) {
    throw new Error("Module not found.");
  }

  await prisma.module.delete({
    where: {
      id,
    },
  });
};