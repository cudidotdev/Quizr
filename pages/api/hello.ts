// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { restrictToLogin } from "api_middlewares";
import connectDB from "database/connect";
import { Quiz, QuizSheet, ScoreBoard, User } from "database/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiHandlerX } from "types/next";

type Data = {
  name: string;
};

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();

  if (req.query.password !== process.env.Password)
    return res.status(200).json({ name: "MR. X" });

  await ScoreBoard.deleteMany({});
  await QuizSheet.deleteMany({});
  await Quiz.updateMany({}, { $unset: { timesTaken: "", averageScore: "" } });
  await User.updateMany(
    {},
    { $unset: { quizzesTaken: "", averageScore: "", EXP: "" } }
  );

  return res.status(200).json({ name: "John Doe" });
};

export default handler;
