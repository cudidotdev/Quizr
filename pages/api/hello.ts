// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { restrictToLogin } from "api_middlewares";
import connectDB from "database/connect";
import { User } from "database/models";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiHandlerX } from "types/next";

type Data = {
  name: string;
};

const handler: NextApiHandlerX = async (req, res) => {
  await restrictToLogin(req);
  await User.findByIdAndUpdate(req.user._id, {
    // quizTaking: {
    //   $pull: { $elemMatch: { quizId: "6263c392daa5a546928e2468" } },
    // },
    $pull: { quizTaking: { quizId: "6263c392daa5a546928e2468" } },
  });
  return res.status(200).json({ name: "John Doe" });
};

export default handler;
