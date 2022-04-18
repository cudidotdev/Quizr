export type _note = {
  type: "error" | "info";
  msg: string;
  id: string;
  _new?: boolean;
};
export type note = {
  type: "error" | "info";
  msg: string;
  id: string;
};
