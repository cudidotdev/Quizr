import User from "database/models/User";
import ApiError from "errors/api";
import bcrypt from "bcrypt";

async function validateCredentials(body: any) {
  const { user, password } = body;

  if (!user) throw new ApiError("user", "Please insert username/email");
  if (!password) throw new ApiError("password", "Please insert password");

  const _user = await User.findOne({
    $or: [{ username: user }, { email: user }],
  })
    .collation({ locale: "en", strength: 2 })
    .lean();

  if (!_user) throw new ApiError("user", "Oops, username/email already exists");
  if (!(await bcrypt.compare(password, _user.password)))
    throw new ApiError("password", "Sorry, wrong password");

  return _user;
}

export default validateCredentials;
