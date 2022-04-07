import { NextApiHandlerX } from "types/next";
import { restrictToAdmins } from "api_middlewares";
import connectDB from "database/connect";
import { QuizDraft } from "database/models";
import { generateUniqueQuizTitle, modifyError } from "api_utils";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      await restrictToAdmins(req);
      const title = await generateUniqueQuizTitle();
      const draft = await QuizDraft.create({ title });

      return res.status(201).json({ success: true, data: draft });
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
