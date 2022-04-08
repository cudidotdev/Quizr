import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categories: { type: [String], required: true },
  questions: {
    type: [
      {
        _id: false,
        question: { type: String, required: true },
        index: { type: Number, required: true },
        options: {
          type: { A: String, B: String, C: String, D: String },
          required: true,
        },
        answer: { type: String, enum: ["A", "B", "C", "D"], required: true },
      },
    ],
    required: true,
  },
  createdAt: { type: Date, default: () => Date.now() },
  lastModified: Date,
  currentlyOnEdit: Boolean,
  editId: mongoose.Schema.Types.ObjectId,
});

export default mongoose.models.Quiz ||
  mongoose.model("Quiz", QuizSchema, "quizes");
