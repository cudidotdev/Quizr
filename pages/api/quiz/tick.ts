import { restrictToLogin } from "api_middlewares";
import { modifyError } from "api_utils";
import { submitQuiz } from "api_utils/quiz";
import connectDB from "database/connect";
import { QuizSheet } from "database/models";
import ApiError from "errors/api";
import { NextApiHandlerX } from "types/next";
import validateBody from "validators/quiz/tick";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "PATCH") {
    try {
      await restrictToLogin(req);

      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert an id on query", 400);

      const sheet = await QuizSheet.findById(id).lean();
      const body = validateBody(req.body);

      if (!sheet) throw new ApiError("sheet", "This sheet does not exit", 400);

      if (sheet.userId.toString() != req.user._id.toString())
        throw new ApiError(
          "sheet",
          "This sheet does not correspond to the current user",
          403
        );

      if (sheet.timeStarted + 10 * 60 * 1000 < Date.now()) {
        await submitQuiz(sheet, Date.now());
        throw new ApiError("time", "Quiz time is exceeded", 403);
      }

      if (sheet.answers.some((obj: any) => obj.index == body.index))
        sheet.answers = sheet.answers.map((obj: any) =>
          obj.index === body.index ? body : obj
        );
      else sheet.answers.push(body);

      await QuizSheet.findByIdAndUpdate(id, sheet);

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
      message: "Only a patch request is accepted in this route",
    },
  });
};

export default handler;
