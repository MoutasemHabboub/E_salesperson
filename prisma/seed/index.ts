import { PrismaClient } from '@prisma/client';
import { UserSeeder } from './data/user';

const prisma = new PrismaClient();

async function main() {
  await UserSeeder.seed(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Successfully seeded database. Closing connection.');
    await prisma.$disconnect();
  });
