import ApiError from "errors/api";

export async function validateBody(body: any) {
  const final: any = {};
  const { title, categories, questions } = body;

  if (title) validateTitle(title, final);
  if (categories) validateCategories(categories, final);
  if (questions) validateQuestions(questions, final);

  return final;
}

function validateTitle(title: string, final: any) {
  if (title.length > 100)
    throw new ApiError(
      "title",
      "A quiz title should not be longer than 100 characters",
      400
    );
  final.title = title;
}

function validateCategories(categories: string[], final: any) {
  if (categories.length > 7)
    throw new ApiError("categories", "The categories should not exceed 7", 400);
  if (categories.some((category) => category.length > 32))
    throw new ApiError(
      "categories",
      "Each category should be less than 32 characters",
      400
    );
  final.categories = categories;
}

function validateQuestions(questions: Array<any>, final: any) {
  if (questions.length > 10)
    throw new ApiError(
      "questions",
      "The number of questions should not exceed 10",
      400
    );

  const indexBox: number[] = [];

  questions.forEach((questionObj) => {
    if (questionObj.question.length > 256)
      throw new ApiError(
        "questions",
        "Each question should be less than 256 characters",
        400
      );

    if (indexBox.includes(questionObj.index))
      throw new ApiError(
        "questions",
        "The question index is already taken",
        400
      );
    indexBox.push(questionObj.index);

    const validOptions = ["A", "B", "C", "D"];
    const recievedOptions: string[] = [];

    for (let option in questionObj.options) {
      if (!validOptions.includes(option))
        throw new ApiError(
          "question",
          "The option object should have keys in form A, B, C and D",
          400
        );

      if (!questionObj.options[option])
        throw new ApiError(
          "questions",
          `Please include an option in ${option}`,
          400
        );

      if (questionObj.options[option].length > 256)
        throw new ApiError(
          "questions",
          `Each option should contain at most 256 characters`,
          400
        );

      recievedOptions.push(option);
    }

    validOptions.forEach((opt) => {
      if (!recievedOptions.includes(opt))
        throw new ApiError("questions", `Please include option ${opt}`, 400);
    });

    if (!validOptions.includes(questionObj.answer))
      throw new ApiError(
        "questions",
        "The answer should be in form A, B, C or D",
        400
      );
  });

  final.questions = questions;
}