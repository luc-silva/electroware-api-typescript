import mongoose from "mongoose";
const { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASS } = process.env;

export async function connectDB() {
  try {
    const connectionString = `mongodb://user:pass@mongodb1:27017,mongodb2:27018/project_electroware?replicaSet=mongo-cluster`;
    await mongoose.connect(connectionString ).then(() => {
      console.log(`Database connected`);
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
