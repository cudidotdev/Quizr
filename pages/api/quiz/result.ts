import { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { modifyError } from "api_utils";
import { restrictToLogin } from "api_middlewares";
import ApiError from "errors/api";
import { User, Quiz, ScoreBoard } from "database/models";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      let { urlName, user: username }: any = req.query;

      if (!username) {
        await restrictToLogin(req, "You need to login to view result");
        username = req.user.username;
      }

      if (!urlName)
        throw new ApiError("", "Please insert urlName on query", 400);

      const quiz = await Quiz.findOne({ urlName }).lean();
      if (!quiz) throw new ApiError("", "No quiz found with such urlName", 404);

      const user = await User.findOne({ username }).lean();
      if (!user)
        throw new ApiError("", `No user with username ${username}`, 404);

      const result = await ScoreBoard.findOne({
        quiz: quiz._id,
        user: user._id,
      }).select("score correction -_id");

      if (!result)
        throw new ApiError(
          "",
          `Sorry ${user.username} has no result on ${quiz.title}`,
          404
        );

      return res.status(200).json({ success: true, data: result });
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
