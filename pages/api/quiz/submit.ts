import { NextApiHandlerX } from "types/next";
import { modifyError, gradeQuiz } from "api_utils";
import connectDB from "database/connect";
import { restrictToLogin } from "api_middlewares";
import ApiError from "errors/api";
import { Quiz, QuizSheet, User } from "database/models";
import { validateAnswers } from "validators/quiz/submit";
import { submitQuiz } from "api_utils/quiz";

const handler: NextApiHandlerX = async (req, res) => {
  const timeSubmited = Date.now();
  await connectDB();
  if (req.method === "POST") {
    try {
      await restrictToLogin(req);

      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert an id on query", 400);

      const sheet = await QuizSheet.findById(id).lean();
      if (!sheet)
        throw new ApiError("sheet", "No sheet found with such id", 404);
      if (sheet.userId.toString() != req.user._id.toString())
        throw new ApiError(
          "sheet",
          "This sheet does not correspond to the current user",
          400
        );

      const data = await submitQuiz(sheet, timeSubmited);
      return res.status(200).json({ success: true, data: data });
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
