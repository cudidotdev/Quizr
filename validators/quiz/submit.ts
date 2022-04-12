import ApiError from "errors/api";

export function validateAnswers(answerSheet: any) {
  const final: any = [];

  const indexBox: any = [];
  answerSheet.forEach((answerObj: any) => {
    const { index, answer } = answerObj;

    if (index > 10 || index < 1 || !Number.isInteger(index))
      throw new ApiError(
        "answer",
        "The answer index should be an integer from 1 to 10"
      );
    if (indexBox.includes(index))
      throw new ApiError("answer", "The answer index is already taken", 400);
    indexBox.push(index);

    if (!["A", "B", "C", "D"].includes(answer))
      throw new ApiError(
        "answer",
        "The answer should be in the form A, B, C or D",
        400
      );

    final.push({ index, answer });
  });

  return final;
}
