import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connectionString = "mongodb+srv://lucasAdmin:lucas1353@cluster0.oximzo5.mongodb.net/project_electroware?retryWrites=true&w=majority";
    await mongoose.connect(connectionString ).then(() => {
      console.log(`Database connected`);
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
