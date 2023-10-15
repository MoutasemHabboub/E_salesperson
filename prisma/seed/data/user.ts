import { PrismaClient, ROLE } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  static async seed(prisma: PrismaClient) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('P@ssw0rd', salt);
    const hashedPassword1 = await bcrypt.hash('P@ssw0rd', salt);
    const hashedPassword2 = await bcrypt.hash('P@ssw0rd', salt);

    const regionsData = [
      { name: 'Lebanon' },
      { name: 'Coastal' },
      { name: 'Southern' },
      { name: 'Northern' },
      { name: 'Eastern' },
    ];
    await prisma.region.createMany({ data: regionsData });

    const users = [
      // user 1
      {
        name: 'SabahAssi',
        password: hashedPassword,
        regionId: 1,
        role: ROLE.ADMIN,
        number: 654,
      },
      // user 2
      {
        name: 'Assi',
        role: ROLE.ADMIN,
        regionId: 2,
        password: hashedPassword2,
        number: 234,
      },
      // user 3
      {
        name: 'Sabah',
        password: hashedPassword1,
        role: ROLE.ADMIN,
        regionId: 3,
        number: 123,
      },
    ];
    await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });
    return await prisma.user.findMany();
  }
}
