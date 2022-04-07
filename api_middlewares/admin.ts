import ApiError from "errors/api";
import { NextApiRequestX } from "types/next";
import { attachUser } from "./user";

export async function restrictToAdmins(req: NextApiRequestX) {
  await attachUser(req);
  if (!req.user?.isAdmin)
    throw new ApiError(
      "user",
      "This user cannot perform this kind of operations",
      401
    );
}
