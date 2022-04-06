import { NextApiHandler } from "next";
import connectDB from "database/connect";
import validateCredentials from "validators/user/login";
import Session from "database/models/Session";
import cookie from "cookie";

const handler: NextApiHandler = async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      const { username, _id } = await validateCredentials(req.body);
      const ssId = await Session.create({ uId: _id });

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("ssId", ssId._id, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7 * 52,
        })
      );

      return res.status(200).json({ success: true, data: { _id, username } });
    } catch (error: any) {
      const { name, message } = error;
      return res.status(500).json({ success: false, error: { name, message } });
    }
  }
};

export default handler;
