// prisma/seed.js
// Bootstraps the database with required lookup data and the initial admin user.
// Run with: npx prisma db seed
//
// IMPORTANT: Change the admin password immediately after first deployment.
//            Default admin credentials: admin@hoop.local / admin1234

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env from the BackEnd root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Prisma v7 requires a Driver Adapter — mirrors src/config/prisma.config.js
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─────────────────────────────────────────────
  // 1. Roles
  // ─────────────────────────────────────────────
  const roles = [
    { roleId: 1, roleName: 'user' },
    { roleId: 2, roleName: 'venue_owner' },
    { roleId: 3, roleName: 'admin' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { roleId: role.roleId },
      update: {},
      create: role,
    });
  }
  console.log('✅ Roles seeded (user, venue_owner, admin)');

  // ─────────────────────────────────────────────
  // 2. Event Types
  // ─────────────────────────────────────────────
  const eventTypes = [
    { eventTypeId: 1, typeName: 'Birthday' },
    { eventTypeId: 2, typeName: 'Wedding' },
    { eventTypeId: 3, typeName: 'Corporate' },
    { eventTypeId: 4, typeName: 'Gathering' },
    { eventTypeId: 5, typeName: 'Party' },
    { eventTypeId: 6, typeName: 'Other' },
  ];

  for (const type of eventTypes) {
    await prisma.eventType.upsert({
      where: { eventTypeId: type.eventTypeId },
      update: {},
      create: type,
    });
  }
  console.log('✅ Event types seeded (Birthday, Wedding, Corporate, Gathering, Party, Other)');

  // ─────────────────────────────────────────────
  // 3. Admin User
  // ─────────────────────────────────────────────
  const DEFAULT_PASSWORD = 'admin1234';
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hoop.local' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@hoop.local',
      passwordHash,
    },
  });

  // Assign the admin role (roleId: 3) — upsert guards against duplicate
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.userId,
        roleId: 3,
      },
    },
    update: {},
    create: {
      userId: adminUser.userId,
      roleId: 3,
    },
  });

  console.log(`✅ Admin user seeded — email: admin@hoop.local, password: ${DEFAULT_PASSWORD}`);
  console.log('⚠️  IMPORTANT: Change the admin password after first login!');

  console.log('\n🎉 Database seeding complete!');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
