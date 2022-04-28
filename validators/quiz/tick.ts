import ApiError from "errors/api";

export default function validateBody(body: any) {
  const { index, answer } = body;
  const final: any = {};

  validateIdx(index, final);
  validateAns(answer, final);

  return final;
}

function validateIdx(index: number, final: any) {
  if (index === undefined)
    throw new ApiError("idx", "Please insert an index", 400);

  const idx = Number(index);

  if (!(idx > 0 && idx < 11 && Number.isInteger(idx)))
    throw new ApiError(
      "idx",
      "The index should be an interger from 1 to 10",
      400
    );

  final.index = idx;
}

function validateAns(ans: string, final: any) {
  if (ans === undefined)
    throw new ApiError("answer", "Please insert an answer", 400);

  if (!["A", "B", "C", "D"].includes(ans))
    throw new ApiError("answer", "Answer should be in form A, B, C, D", 400);

  final.answer = ans;
}
