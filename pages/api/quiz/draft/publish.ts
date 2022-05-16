import type { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { modifyError, getQuizDraftById, indexQuiz } from "api_utils";
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

      const _quiz = await getQuizDraftById(id);
      let quiz = validateQuiz(_quiz);

      /* the ogfile prop signifies that is was from an already published quiz */
      if (_quiz.ogFile)
        quiz = await Quiz.findByIdAndUpdate(
          _quiz.ogFile,
          {
            ...quiz,
            lastModified: Date.now(),
            $unset: { currentlyOnEdit: "", editId: "" },
          },
          { new: true }
        );
      else quiz = await Quiz.create(quiz);

      await QuizDraft.findByIdAndDelete(id);
      await indexQuiz(quiz, !_quiz.ogFile);

      return res.status(201).json({ success: true, data: { id: quiz._id } });
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
