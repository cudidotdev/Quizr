import User from "database/models/User";
import type { NextApiHandler } from "next";
import validateCredentials from "validators/user/create";
import connectDB from "database/connect";

const handler: NextApiHandler = async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      const userCredentials = await validateCredentials(req.body);
      await User.create(userCredentials);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error(error);
      let { name, message } = error;
      if (error.code === 11000) {
        [name] = Object.keys(error.keyPattern);
        message = `Oops, the ${name} is already taken`;
      }
      return res.status(500).json({ success: false, error: { name, message } });
    }
  }
};

export default handler;
