export function doesDiffer(first: any, second: any): boolean {
  if (first === undefined && second === undefined) return false;
  if (first === undefined || second === undefined) return true;

  if (typeof first === "object") {
    if (first === null && second === null) return false;
    if (first === null || second === null) return true;
    if (Object.keys(first).length !== Object.keys(second).length) return true;

    for (let key in first) {
      if (doesDiffer(first[key], second?.[key])) return true;
    }
    return false;
  }

  if (first !== second) return true;

  return false;
}

export function serializeQuery(obj: { [key: string]: any }) {
  let string = "";

  for (const key in obj) {
    string = `${string}${string !== "" ? "&" : ""}${key}=${obj[key]}`;
  }

  return string;
}
