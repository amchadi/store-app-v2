import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

async function testDatabaseConnection(): Promise<void> {
  const adapter = new PrismaMariaDb({
    host: process.env['DB_HOST'],
    port: Number(process.env['DB_PORT']),
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    allowPublicKeyRetrieval: true,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$queryRaw`SELECT 1`;

    console.log('Database connection: true');
    process.exitCode = 0;
  } catch (error) {
    console.error('Database connection: false');
    console.error(
      error instanceof Error ? error.message : 'Unknown database error',
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void testDatabaseConnection();
