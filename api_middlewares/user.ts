import ApiError from "errors/api";
import Session from "database/models/Session";
import User from "database/models/User";
import type { NextApiRequestX } from "types/next";

export async function attachUser(req: NextApiRequestX) {
  const { ssId } = req.cookies;
  if (!ssId) return (req.user = null);

  const _user = await Session.findById(ssId)
    .populate("uId")
    .select("uId -_id")
    .lean();
  if (!_user || !_user.uId) return (req.user = null);

  const { username, _id, email, profilePicture } = _user.uId;
  const user: any = { username, _id, email, profilePicture };
  if (_user.uId.isAdmin) user.isAdmin = true;
  req.user = user;
}

export async function restrictToLogin(req: NextApiRequestX) {
  await attachUser(req);
  if (!req.user)
    throw new ApiError("login", "No user is logged-in currently", 401);
}
