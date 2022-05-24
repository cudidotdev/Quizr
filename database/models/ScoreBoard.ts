import mongoose from "mongoose";

const ScoreBoardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true },
  correction: {
    type: [
      {
        _id: false,
        index: { type: Number, required: true },
        question: { type: String, required: true },
        correct: { type: Number, enum: [-1, 0, 1], required: true },
        answer: {
          _id: false,
          val: { type: String, enum: ["A", "B", "C", "D"] },
          text: { type: String },
        },
      },
    ],
    required: true,
  },
  quizTime: { type: Number, required: true },
  dateSubmitted: { type: Date, default: () => Date.now() },
});

export default mongoose.models.ScoreBoard ||
  mongoose.model("ScoreBoard", ScoreBoardSchema, "scoreBoard");
