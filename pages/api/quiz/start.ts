import { NextApiHandlerX } from "types/next";
import { modifyError } from "api_utils";
import connectDB from "database/connect";
import { restrictToLogin } from "api_middlewares";
import ApiError from "errors/api";
import { QuizSheet, Quiz } from "database/models";
import { submitQuiz } from "api_utils/quiz";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      await restrictToLogin(req);

      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert an id on query", 400);
      if (!(await Quiz.findById(id).select("_id")))
        throw new ApiError("id", "No quiz found with such id", 400);

      const prev = await QuizSheet.findOne({
        quizId: id,
        userId: req.user._id,
      });

      if (prev) {
        const { _id: id, timeStarted, answers } = prev;
        if (
          new Date(timeStarted.getTime() + 10 * 60 * 1000).getTime() >
          Date.now()
        )
          return res
            .status(200)
            .json({ success: true, data: { id, timeStarted, answers } });
        submitQuiz(prev);
        throw new ApiError("", "You have taken this quiz", 400);
      }

      const sheet = await QuizSheet.create({
        userId: req.user._id,
        quizId: id,
        timeStarted: Date.now() + 15 * 1000,
      });
      const { _id, timeStarted } = sheet;
      return res
        .status(200)
        .json({ success: true, data: { id: _id, timeStarted, answers: [] } });
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
      message: "Only a post request is accepted in this route",
    },
  });
};

export default handler;
