import { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { restrictToAdmins } from "api_middlewares";
import { getQuizById, getAllQuizes, modifyError } from "api_utils";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      await restrictToAdmins(req);
      const { id, sort, limit, page } = req.query;
      let data: any;

      if (id) data = await getQuizById(id);
      else data = await getAllQuizes({ sort, limit, page });

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
