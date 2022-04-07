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
    throw new ApiError("username", "Oops, a username is required", 400);
  if (username.length > 64)
    throw new ApiError(
      "username",
      "Opps a username cannot be more than 64 characters",
      400
    );
}

function validateEmail(email: string) {
  if (!email || !email.length)
    throw new ApiError("email", "Oops, an email is required", 400);
  if (email.length > 256)
    throw new ApiError(
      "email",
      "Opps an email cannot be more than 128 characters",
      400
    );
  if (email.match(/@/g)?.length !== 1)
    throw new ApiError("email", "An email should contain one @", 400);
  if (email.length < 3)
    throw new ApiError(
      "email",
      "An email is supposed to have at least 3 characters",
      400
    );
  if (!/[\w|\-|&|.|+|/|(|)|]+@[\w|\-|&|.|+|]+/.test(email))
    throw new ApiError(
      "email",
      "Sorry, the email you provided either contains unaccepted characters or is in a wrong format",
      400
    );
}

function validatePassword(password: string, confirmPassword: string) {
  if (!password || !password.length)
    throw new ApiError("password", "Oops, please choose a password", 400);
  if (password.length < 4)
    throw new ApiError(
      "password",
      "Your password should contain at least 4 characters",
      400
    );
  if (password.length > 64)
    throw new ApiError(
      "password",
      "Your password should be less than 64 characters",
      400
    );
  if (!confirmPassword || !confirmPassword.length)
    throw new ApiError("confirmPassword", "Please confirm your password", 400);
  if (confirmPassword !== password)
    throw new ApiError("confirmPassword", "Passwords doesn't match", 400);
}

export default validate;
