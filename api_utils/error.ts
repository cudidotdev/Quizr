export default function modifyError(error: any) {
  let { name, message, status = 500 } = error;

  if (error.code == 11000) {
    [name] = Object.keys(error.keyPattern);
    message = `Oops, the ${name} is already taken`;
    status = 400;
  }

  if (error.name === "CastError") {
    status = 400;
    message = `${error.value} is a wrong type/format of ${error.path}`;
  }

  if (error.name.startsWith("Mongo") && error.code != 11000)
    message = `Server error, Please try again`;

  const acceptableStatus = [
    100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300,
    301, 302, 303, 304, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408,
    409, 410, 500, 501, 502, 503, 504, 505,
  ];

  if (!acceptableStatus.includes(status)) status = 500;

  return { name, message, status };
}
