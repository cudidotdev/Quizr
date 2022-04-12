import { NextApiHandlerX } from "types/next";
import { modifyError } from "api_utils";
import connectDB from "database/connect";
import { restrictToLogin } from "api_middlewares";
import ApiError from "errors/api";
import { Quiz, User } from "database/models";

const handler: NextApiHandlerX = async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      await restrictToLogin(req);

      const { id } = req.query;
      if (!id) throw new ApiError("id", "Please insert an id on query", 400);
      if (!(await Quiz.findById(id).select(id)))
        throw new ApiError("id", "No quiz found with such id", 400);

      await User.findByIdAndUpdate(req.user._id, {
        $push: { quizTaking: { quizId: id, timeStarted: Date.now() } },
      });

      return res.status(200).json({ success: true, data: { id } });
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
