import { NextApiHandler } from "next";
import connectDB from "database/connect";
import validateCredentials from "validators/user/login";
import { Session } from "database/models";
import cookie from "cookie";
import { modifyError } from "api_utils";

const handler: NextApiHandler = async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      const { username, _id, profilePicture, email, isAdmin } =
        await validateCredentials(req.body);
      const { ssId: prevSsId } = req.cookies;
      const ssId = await Session.create({ uId: _id });

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("ssId", ssId._id, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7 * 52,
        })
      );
      prevSsId && (await Session.findByIdAndDelete(prevSsId));

      return res.status(200).json({
        success: true,
        data: {
          _id,
          username,
          profilePicture,
          email,
          [`${isAdmin === true ? "isAdmin" : "user"}`]: true,
        },
      });
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
