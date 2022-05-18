import type { NextApiHandlerX } from "types/next";
import { restrictToAdmins } from "api_middlewares";
import connectDB from "database/connect";
import { Quiz, QuizDraft, QuizSearchIndex } from "database/models";
import { modifyError } from "api_utils";
import ApiError from "errors/api";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "DELETE") {
    try {
      await restrictToAdmins(req);

      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert quiz id on query", 400);
      const data = await Quiz.findByIdAndDelete(id);

      if (!data)
        throw new ApiError(
          "id",
          `Found no quiz draft with an id of ${id}`,
          400
        );

      if (data.currentlyOnEdit) await QuizDraft.findByIdAndDelete(data.editId);

      //remove from search indexes
      await QuizSearchIndex.updateMany(
        {},
        { $pull: { quizzes: { quizId: id } } }
      );

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
      message: "Only a delete request is accepted in this route",
    },
  });
};

export default handler;
