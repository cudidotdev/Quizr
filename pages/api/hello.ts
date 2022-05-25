// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { restrictToLogin } from "api_middlewares";
import connectDB from "database/connect";
import { Quiz, QuizSheet, ScoreBoard, User } from "database/models";
import { NextApiHandlerX } from "types/next";
import bcrypt from "bcrypt";

type Data = {
  name: string;
};

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();

  if (req.query.password !== process.env.Password)
    return res.status(200).json({ name: "MR. X" });

  return res.status(200).json({ name: "John Doe" });
};

export default handler;
