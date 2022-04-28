import mongoose from "mongoose";

const QuizSheetSchema = new mongoose.Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  quizId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  answers: [
    {
      _id: false,
      index: Number,
      answer: { type: String, enum: ["A", "B", "C", "D"] },
    },
  ],
  timeStarted: { type: Date, default: () => Date.now() },
});

export default mongoose.models.QuizSheet ||
  mongoose.model("QuizSheet", QuizSheetSchema, "quizSheets");
