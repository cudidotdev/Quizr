import mongoose from "mongoose";

async function connectDB() {
  if (
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  )
    return;
  await mongoose.connect(process.env.MONGOURI!);
  console.log("mongoose>> connected");
}

export default connectDB;
