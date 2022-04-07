import mongoose from "mongoose";

const QuizDraftSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  categories: [String],
  questions: [
    {
      question: String,
      index: Number,
      options: { A: String, B: String, C: String, D: String },
      answer: { type: String, enum: ["A", "B", "C", "D"] },
    },
  ],
  createdAt: { type: Date, default: () => Date.now() },
  lastModified: Date,
});

export default mongoose.models.QuizDraft ||
  mongoose.model("QuizDraft", QuizDraftSchema, "quizDrafts");