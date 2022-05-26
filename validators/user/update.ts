import ApiError from "errors/api";
import { validateEmail, validateUsername } from "./create";

function validate(body: any) {
  const { username, email, profilePicture, password } = body;
  const final: any = {};

  if (username) validateUsername(username, final);
  if (email) validateEmail(email, final);
  if (profilePicture) final.profilePicture = profilePicture;
  if (!password)
    throw new ApiError("password", "Enable update by entering password", 400);

  final.password = password;
  return final;
}

export default validate;
