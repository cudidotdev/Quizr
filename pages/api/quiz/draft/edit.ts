import { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { restrictToAdmins } from "api_middlewares";
import { validateBody } from "validators/quiz/update";
import ApiError from "errors/api";
import { modifyError, modifyQuizDraft } from "api_utils";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "PATCH") {
    try {
      await restrictToAdmins(req);

      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert quiz id on query", 400);

      const body = await validateBody(req.body);
      const data = await modifyQuizDraft({ id, body });

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
      message: "Only a patch request is accepted in this route",
    },
  });
};

export default handler;
