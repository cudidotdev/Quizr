import bcrypt from "bcrypt";
import ApiError from "errors/api";

async function validate(body: any) {
  let { username, email, password, confirmPassword } = body;
  validateUsername(username);
  validateEmail(email);
  validatePassword(password, confirmPassword);

  password = await bcrypt.hash(password, 10);

  return { username, email, password };
}

function validateUsername(username: string) {
  if (!username || !username.length)
    throw new ApiError("username", "Oops, a username is required");
  if (username.length > 64)
    throw new ApiError(
      "username",
      "Opps a username cannot be more than 64 characters"
    );
}

function validateEmail(email: string) {
  if (!email || !email.length)
    throw new ApiError("email", "Oops, an email is required");
  if (email.length > 128)
    throw new ApiError(
      "email",
      "Opps an email cannot be more than 128 characters"
    );
}

function validatePassword(password: string, confirmPassword: string) {
  if (!password || !password.length)
    throw new ApiError("password", "Oops, please choose a password");
  if (password.length < 4)
    throw new ApiError(
      "password",
      "Your password should contain at least 4 characters"
    );
  if (password.length > 64)
    throw new ApiError(
      "password",
      "Your password should be less than 64 characters"
    );
}

export default validate;
