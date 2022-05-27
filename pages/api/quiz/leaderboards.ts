import { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { modifyError } from "api_utils";
import { User } from "database/models";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      let data = await User.find()
        .select("username profilePicture quizzesTaken averageScore EXP")
        .sort("-EXP")
        .lean();

      data.forEach((e, idx) => {
        e.rank = idx + 1;
      });

      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.log(error);
      const { name, message, status } = modifyError(error);
      return res
        .status(status)
        .json({ success: false, error: { name, message } });
    }
  }
  return res.status(405).json({
    success: false,
    error: {
      name: "method",
      message: "Only a get request is accepted in this route",
    },
  });
};

export default handler;
