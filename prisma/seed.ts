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

  const password = await bcrypt.hash(
    process.env.ADMIN_PASSWORD!,
    12
  );

  await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      username: 'admin',
      password,
      role: 'ADMIN',
    },
  });

  console.log('Admin created');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });