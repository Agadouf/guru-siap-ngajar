import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async ({ email, password }) => {
  const admin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (!admin) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    admin.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
  };
};

export const changePassword = async (
  adminId,
  currentPassword,
  newPassword
) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id: adminId,
    },
  });

  if (!admin) {
    throw new Error("Admin not found.");
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    admin.password
  );

  if (!isMatch) {
    throw new Error("Current password is incorrect.");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  if (currentPassword === newPassword) {
    throw new Error("New password must be different from the current password.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.admin.update({
    where: {
      id: adminId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password changed successfully.",
  };
};