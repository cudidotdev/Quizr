import mongoose from "mongoose";

const SearchSchema = new mongoose.Schema({
  name: { type: String, lowercase: true, required: true },
  quizzes: {
    type: [
      {
        _id: false,
        quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
        score: Number,
      },
    ],
  },
});

export default mongoose.models.QuizSearchIndex ||
  mongoose.model("QuizSearchIndex", SearchSchema, "quizSearchIndex");
