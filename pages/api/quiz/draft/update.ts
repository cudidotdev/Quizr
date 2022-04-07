import { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { restrictToAdmins } from "api_middlewares";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  try {
    if (req.method === "PUT") {
      await restrictToAdmins(req);
    }
  } catch (error: any) {
    console.log(error);
    const { name, message } = error;
    return res.status(500).json({ success: false, error: { name, message } });
  }
};

export default handler;
