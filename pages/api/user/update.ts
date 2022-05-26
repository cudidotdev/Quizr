import { NextApiHandlerX } from "types/next";
import connectDB from "database/connect";
import { modifyError } from "api_utils";
import ApiError from "errors/api";
import { restrictToLogin } from "api_middlewares";
import validate from "validators/user/update";
import { User } from "database/models";
import bcrypt from "bcrypt";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "PATCH") {
    try {
      await restrictToLogin(req, "You need to login to perform update");
      let { body } = req;

      body = validate(body);
      const user = await User.findById(req.user._id).select("password");

      if (!(await bcrypt.compare(body.password, user.password)))
        throw new ApiError("password", "Sorry, wrong password", 400);
      delete body.password;

      const newUser = await User.findByIdAndUpdate(user._id, body, {
        new: true,
      })
        .select("-password -createdAt")
        .lean();

      return res.status(201).json({ success: true, data: newUser });
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
      message: "Only a patch request is accepted in this route",
    },
  });
};

export default handler;
