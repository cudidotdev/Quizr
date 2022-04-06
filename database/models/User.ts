import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  profilePicture: String,
  password: String,
  createdAt: Date,
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema, "users");
