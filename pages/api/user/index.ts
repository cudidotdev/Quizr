import { attachUser } from "api_middlewares";
import { modifyError } from "api_utils";
import connectDB from "database/connect";
import { NextApiHandlerX } from "types/next";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      await attachUser(req);
      return res.status(200).json({ success: true, data: req.user });
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
