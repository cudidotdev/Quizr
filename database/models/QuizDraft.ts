import mongoose from "mongoose";

const QuestionDraftSchema = new mongoose.Schema({
  question: String,
  index: Number,
  options: [
    {
      option: String,
      index: Number,
      isCorrect: Boolean,
    },
  ],
});

const QuizDraftSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  categories: String,
  questions: [QuestionDraftSchema],
  createdAt: { type: Date, default: () => Date.now() },
  modifiedAt: Date,
});

export default mongoose.models.QuizDraft ||
  mongoose.model("QuizDraft", QuizDraftSchema, "quizDrafts");
