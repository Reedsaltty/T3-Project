import prisma from "./config/prisma.config.js";
import bcrypt from "bcrypt";

const mockUsers = [
  {
    username: "alice_organizer",
    email: "alice@example.com",
    password: "Password123",
  },
  {
    username: "bob_planner",
    email: "bob@example.com",
    password: "Password123",
  },
  {
    username: "charlie_coord",
    email: "charlie@example.com",
    password: "Password123",
  },
];

async function insertMockUsers() {
  console.log("Starting mock user insertion...");

 
    try {
      
      const user = await prisma.user.findMany();
      console.log(user)

      
    } catch (error) {
      console.error(error);
    }

  console.log("Mock user insertion process finished.");
}

insertMockUsers()
  .catch((e) => {
    console.error("Fatal error during insertion script execution:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
