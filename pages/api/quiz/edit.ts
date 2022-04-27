import { NextApiHandlerX } from "types/next";
import { modifyError, getQuizById } from "api_utils";
import connectDB from "database/connect";
import { restrictToAdmins } from "api_middlewares";
import ApiError from "errors/api";
import { Quiz, QuizDraft } from "database/models";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "PUT") {
    try {
      await restrictToAdmins(req);

      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert an id on query", 400);

      const quiz = await getQuizById(id);
      if (quiz.currentlyOnEdit)
        return res
          .status(201)
          .json({ success: true, data: { id: quiz.editId } });

      const { title, introText, categories, questions, urlName }: any = quiz;
      const draft = await QuizDraft.create({
        title,
        introText,
        categories,
        questions,
        urlName,
        ogFile: quiz._id,
      });

      await Quiz.findByIdAndUpdate(quiz._id, {
        currentlyOnEdit: true,
        editId: draft._id,
      });

      return res.status(201).json({ success: true, data: { id: draft._id } });
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
      message: "Only a put request is accepted in this route",
    },
  });
};

export default handler;
