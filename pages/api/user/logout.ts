import User from "database/models/User";
import Session from "database/models/Session";
import { NextApiHandler } from "next";
import ApiError from "errors/api";
import connectDB from "database/connect";
import cookie from "cookie";

const handler: NextApiHandler = async (req, res) => {
  await connectDB();
  if (req.method === "DELETE") {
    try {
      const { ssId } = req.cookies;
      if (!ssId) throw new ApiError("", "You are not logged in yet.");

      await Session.findByIdAndDelete(ssId);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("ssId", "", { maxAge: -3600 })
      );

      return res.status(200).json({ success: true });
    } catch (error: any) {
      const { name, message } = error;
      return res.status(500).json({ success: false, error: { name, message } });
    }
  }
};

export default handler;
