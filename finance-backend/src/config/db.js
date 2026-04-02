import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  });

export default prisma;
