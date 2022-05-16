import mongoose from "mongoose";

const QuizDraftSchema = new mongoose.Schema({
  title: { type: String, required: true },
  introText: String,
  categories: [{ type: String, lowercase: true }],
  questions: [
    {
      _id: false,
      question: String,
      index: Number,
      options: { A: String, B: String, C: String, D: String },
      answer: { type: String, enum: ["A", "B", "C", "D"] },
    },
  ],
  urlName: { type: String, lowercase: true },
  createdAt: { type: Date, default: () => Date.now() },
  lastModified: Date,
  ogFile: mongoose.Schema.Types.ObjectId,
});

export default mongoose.models.QuizDraft ||
  mongoose.model("QuizDraft", QuizDraftSchema, "quizDrafts");
