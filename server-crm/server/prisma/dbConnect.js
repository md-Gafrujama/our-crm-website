import prisma from "./prismaClient.js"

async function connectDB() {
  try {
    await prisma.$connect()
    const dbName = process.env.DATABASE_URL.split("/").pop().split("?")[0]
    console.log(`DB connected`)
  } catch (err) {
    console.error("DB connection failed:", err.message)
    process.exit(1)
  }
}

export default connectDB
