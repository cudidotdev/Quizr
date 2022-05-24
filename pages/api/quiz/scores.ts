import { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { modifyError } from "api_utils";
import ApiError from "errors/api";
import { ScoreBoard } from "database/models";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const { qId, uId, sort } = req.query;
      const query: any = {};

      let popualteQuery: string = uId ? "quiz" : "user";
      let popualteSelect: string = uId
        ? "title timesTaken averageScore"
        : "username profilePicture quizzesTaken averageScore EXP";

      if (qId) query.quiz = qId;
      if (uId) query.user = uId;

      const data = await ScoreBoard.find(query)
        .populate(popualteQuery, popualteSelect)
        .select("-correction")
        .lean();

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
