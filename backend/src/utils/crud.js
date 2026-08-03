export const createCrudService = (model) => ({
  getAll: () =>
    model.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

  getById: async (id) => {
    const item = await model.findUnique({
      where: { id },
    });

    if (!item) {
      throw new Error("Item not found.");
    }

    return item;
  },

  create: (data) =>
    model.create({
      data,
    }),

  update: async (id, data) => {
    await model.findUnique({
      where: { id },
    });

    return model.update({
      where: { id },
      data,
    });
  },

  delete: async (id) => {
    await model.delete({
      where: { id },
    });
  },
});