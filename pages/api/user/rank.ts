import User from "database/models/User";
import { NextApiHandler } from "next";
import ApiError from "errors/api";
import connectDB from "database/connect";
import { modifyError } from "api_utils";

const handler: NextApiHandler = async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      if (!id)
        throw new ApiError("query", "Please insert user id on query", 400);

      const user: any = await User.findById(id).select("EXP").lean();
      if (!user) throw new ApiError("user", `No user found with id ${id}`, 404);

      //@ts-ignore
      const rank =
        (await User.find({ EXP: { $gt: user.EXP } }).select("EXP")).length + 1;

      return res.status(200).json({ success: true, data: rank });
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
