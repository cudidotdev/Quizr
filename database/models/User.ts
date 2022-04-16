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
  createdAt: { type: Date, default: () => Date.now() },
  quizStarted: [],
  quizTaking: [
    { _id: false, quizId: mongoose.Schema.Types.ObjectId, timeStarted: Date },
  ],
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema, "users");
