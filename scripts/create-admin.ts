import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'zuicy2021@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'zxcvb';

  console.log(`Creating admin user with email: ${email}`);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // Update existing user to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });
    console.log('✅ Updated existing user to admin:', updatedUser.email);
  } else {
    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Admin',
        password: hashedPassword,
        isAdmin: true,
        emailVerified: new Date(),
      },
    });

    // Create default profile for the admin user
    await prisma.profile.create({
      data: {
        name: 'Admin',
        userId: user.id,
        avatar: '/avatars/default.png',
        isKids: false,
      },
    });

    console.log('✅ Created new admin user:', user.email);
  }

  console.log('\nYou can now login with:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
