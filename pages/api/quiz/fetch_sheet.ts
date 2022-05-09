import { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { modifyError } from "api_utils";
import { QuizSheet } from "database/models";
import ApiError from "errors/api";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert an id on query", 400);

      const data = await QuizSheet.findById(id)
        .select("-_id -quizId -userId")
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
