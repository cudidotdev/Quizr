import { attachUser } from "api_middlewares";
import { modifyError } from "api_utils";
import connectDB from "database/connect";
import { User } from "database/models";
import ApiError from "errors/api";
import { NextApiHandlerX } from "types/next";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      let user;

      if (!id) {
        await attachUser(req);
        user = req.user;
      } else {
        user = await User.findById(id).select("-password -createdAt").lean();
        if (!user) throw new ApiError("", "No user found with such id", 400);
      }

      return res.status(200).json({ success: true, data: user });
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
