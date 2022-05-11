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

export function clone(item: any) {
  if (typeof item !== "object") return item;

  if (item === null) return null;

  if (Array.isArray(item)) {
    const newItem: any[] = [];
    item.forEach((elem, idx) => {
      newItem[idx] = clone(elem);
    });
    return newItem;
  }

  const newItem: { [key: string]: any } = {};
  for (let key in item) {
    newItem[key] = clone(item[key]);
  }
  return newItem;
}

export function serializeQuery(obj: { [key: string]: any }) {
  let string = "";

  for (const key in obj) {
    string = `${string}${string !== "" ? "&" : ""}${key}=${obj[key]}`;
  }

  return string;
}
