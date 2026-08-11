import bcrypt from "bcryptjs";
import prisma from "./src/config/prisma.js";

async function resetAdmin() {
  const email = "admin@gurusiapngajar.id";
  const password = "admin123";
  const name = "Admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    await prisma.admin.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
        name,
      },
    });

    console.log("Admin password reset successfully!");
  } else {
    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    console.log("Admin account created successfully!");
  }

  await prisma.$disconnect();
}

resetAdmin().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});