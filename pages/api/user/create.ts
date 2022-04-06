import User from "database/models/User";
import type { NextApiHandler } from "next";
import validateCredentials from "validators/user/create";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const userCredentials = await validateCredentials(req.body);
      const user = await User.create(userCredentials);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error });
    }
  }
};

export default handler;
