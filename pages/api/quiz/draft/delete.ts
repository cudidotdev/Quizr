import type { NextApiHandlerX } from "types/next";
import { restrictToAdmins } from "api_middlewares";
import connectDB from "database/connect";
import { QuizDraft } from "database/models";
import { modifyError } from "api_utils";
import ApiError from "errors/api";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "DELETE") {
    try {
      await restrictToAdmins(req);

      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert quiz id on query", 400);
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
      message: "Only a delete request is accepted in this route",
    },
  });
};

export default handler;
