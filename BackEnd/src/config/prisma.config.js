import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient
// This prevents creating too many open database connections when your app runs
const prisma = new PrismaClient();


export default prisma;
