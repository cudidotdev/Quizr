import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: {
    type: String,
    default: () =>
      `https://avatars.dicebear.com/api/bottts/${Math.random()}.svg`,
  },
  isAdmin: Boolean,
  quizzesTaken: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  EXP: { type: Number, default: 0 },
  createdAt: { type: Date, default: () => Date.now() },
  quizStarted: String,
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema, "users");
