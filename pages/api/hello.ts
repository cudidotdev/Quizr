// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { restrictToLogin } from "api_middlewares";
import connectDB from "database/connect";
import { quizSearchIndex, User } from "database/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiHandlerX } from "types/next";

type Data = {
  name: string;
};

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  // await quizSearchIndex.deleteMany({});
  return res.status(200).json({ name: "John Doe" });
};

export default handler;
