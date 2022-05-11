import mongoose from "mongoose";

const QuizSheetSchema = new mongoose.Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  quizId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  answers: [
    {
      _id: false,
      index: { type: Number, required: true },
      answer: { type: String, required: true, enum: ["A", "B", "C", "D"] },
    },
  ],
  timeStarted: { type: Number, default: () => Date.now() },
});

export default mongoose.models.QuizSheet ||
  mongoose.model("QuizSheet", QuizSheetSchema, "quizSheets");
