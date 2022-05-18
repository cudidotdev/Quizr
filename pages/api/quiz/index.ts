import { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { getQuizById, getAllQuizes, modifyError } from "api_utils";
import { Quiz } from "database/models";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const { id, select }: any = req.query;
      let data: any;

      if (id) data = await getQuizById(id, select);
      //@ts-ignore
      else data = await getAllQuizes(req.query);

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
