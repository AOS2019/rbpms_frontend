import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: {
      email: process.env.ADMIN_EMAIL!,
    },
  });

  if (existing) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD!,
    12
  );

  await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Admin created');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });


// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// async function main() {

//   console.log("SEED STARTED");
//   const email = process.env.ADMIN_EMAIL!;

//   console.log(email);
  
//   const passwordPlain = process.env.ADMIN_PASSWORD!;

//   const existing = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (existing) {
//     console.log("Admin already exists");
//     return;
//   }

//   const hashedPassword = await bcrypt.hash(passwordPlain, 12);

//   await prisma.user.create({
//     data: {
//       name: process.env.ADMIN_NAME!,
//       email,
//       password: hashedPassword,
//       role: "SUPER_ADMIN",
//     },
//   });

//   console.log("Super admin created successfully");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });