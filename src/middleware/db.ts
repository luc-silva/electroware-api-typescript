import mongoose from "mongoose";
const { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASS } = process.env;

export async function connectDB() {
  try {
    const connectionString = `mongodb://lucasAdmin:lucas1353@mongodb:27017/project_electroware`;
    await mongoose.connect(connectionString ).then(() => {
      console.log(`Database connected`);
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
