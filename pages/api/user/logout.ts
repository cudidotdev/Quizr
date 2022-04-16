import User from "database/models/User";
import { Session } from "database/models";
import { NextApiHandler } from "next";
import ApiError from "errors/api";
import connectDB from "database/connect";
import cookie from "cookie";
import { modifyError } from "api_utils";

const handler: NextApiHandler = async (req, res) => {
  await connectDB();
  if (req.method === "DELETE") {
    try {
      const { ssId } = req.cookies;
      if (!ssId) throw new ApiError("login", "You are not logged in yet.", 401);

      await Session.findByIdAndDelete(ssId);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("ssId", "", { path: "/", maxAge: -3600 })
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
