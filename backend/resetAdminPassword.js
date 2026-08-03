import bcrypt from "bcrypt";
import prisma from "./src/config/prisma.js";

async function resetPassword() {
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.admin.update({
    where: {
      email: "admin@gurusiapngajar.id",
    },
    data: {
      password: hashed,
    },
  });

  console.log("Password reset successfully!");
  process.exit();
}

resetPassword();