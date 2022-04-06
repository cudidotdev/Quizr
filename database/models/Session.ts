import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  uId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: () => Date.now() },
});

export default mongoose.models.Session ||
  mongoose.model("Session", SessionSchema, "session");
