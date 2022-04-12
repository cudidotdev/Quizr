import { NextApiHandlerX } from "types/next";
import { modifyError, gradeQuiz } from "api_utils";
import connectDB from "database/connect";
import { restrictToLogin } from "api_middlewares";
import ApiError from "errors/api";
import { Quiz, User } from "database/models";
import { validateAnswers } from "validators/quiz/submit";

const handler: NextApiHandlerX = async (req, res) => {
  const timeSubmited = Date.now();
  await connectDB();
  if (req.method === "POST") {
    try {
      await restrictToLogin(req);

      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert an id on query", 400);

      const quizTaking = (
        await User.findOne({
          _id: req.user._id,
          "quizTaking.quizId": id,
        })
          .select("quizTaking -_id")
          .lean()
      ).quizTaking;

      if (!quizTaking)
        throw new ApiError(
          "id",
          "The user isn't taking any quiz with this id",
          400
        );

      const answerSheet = validateAnswers(req.body);
      const score = await gradeQuiz(answerSheet, id);
      const timeStarted: Date = quizTaking.find(
        (q: any) => q.quizId == id
      ).timeStarted;
      const timeTaken =
        new Date(timeSubmited - timeStarted.getTime()).getTime() / 1000;
      const exp = (score * 180) / timeTaken;

      return res.status(200).json({
        success: true,
        data: { score, timeTaken, exp },
      });
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
