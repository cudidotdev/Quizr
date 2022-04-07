import type { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { modifyError, getQuizDraftById } from "api_utils";
import { restrictToAdmins } from "api_middlewares";
import ApiError from "errors/api";
import { Quiz, QuizDraft } from "database/models";
import { validateQuiz } from "validators/quiz/publish";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      await restrictToAdmins(req);

      const { id } = req.query;
      if (!id)
        throw new ApiError("id", "Please insert quiz id in the query", 400);

      let quiz = await getQuizDraftById(id);
      quiz = validateQuiz(quiz);
      await Quiz.create(quiz);
      await QuizDraft.findByIdAndDelete(id);

      return res.status(200).json({ success: true });
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
