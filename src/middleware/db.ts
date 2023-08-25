import mongoose from "mongoose";

export async function connectDB() {
  const connectionString = process.env.MONGO_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("Connection string required.");
  }
  await mongoose.connect(connectionString);

  mongoose.connection.on("connected", () => {
    console.log(`Database connected`);
  });

  mongoose.connection.on("error", (e) => {
    throw new Error(e);
  });
}
