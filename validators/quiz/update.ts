import ApiError from "errors/api";

export async function validateBody(body: any) {
  const final: any = {};
  const { title, categories, questions, description } = body;

  if (title) validateTitle(title, final);
  if (categories) validateCategories(categories, final);
  if (questions) validateQuestions(questions, final);
  if (description) validateDescription(description, final);

  return final;
}

function validateTitle(title: string, final: any) {
  if (typeof title !== "string")
    throw new ApiError("title", "The title should be a string");

  title = title.trim();

  if (title.length > 100)
    throw new ApiError(
      "title",
      "A quiz title should not be longer than 100 characters",
      400
    );

  final.title = title;
}

function validateCategories(categories: string[], final: any) {
  if (
    !Array.isArray(categories) ||
    categories.some((category) => typeof category !== "string")
  )
    throw new ApiError(
      "categories",
      "The categories  should be an array of strings",
      400
    );

  categories = categories
    .map((category) => category.trim())
    .filter((category) => category !== "");

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
  if (!Array.isArray(questions))
    throw new ApiError("questions", "The questions should be in an array", 400);

  if (questions.length > 10)
    throw new ApiError(
      "questions",
      "The number of questions should not exceed 10",
      400
    );

  const indexBox: number[] = [];

  questions = questions.map((questionObj) => {
    let { question, index, options, answer } = questionObj;

    if (question) {
      if (typeof question !== "string")
        throw new ApiError("question", "The question should be a string");

      question = question.trim();

      if (question.length > 256)
        throw new ApiError(
          "questions",
          "Each question should be less than 256 characters",
          400
        );
    }

    if (index) {
      if (!(index > 0) || !(index < 11) || !Number.isInteger(index))
        throw new ApiError(
          "questions",
          "The question index should be integers from 1 to 10"
        );

      if (indexBox.includes(index))
        throw new ApiError(
          "questions",
          "The question index is already taken",
          400
        );
      indexBox.push(index);
    }

    const validOptions = ["A", "B", "C", "D"];
    const recievedOptions: string[] = [];

    if (options) {
      for (let option in options) {
        if (!validOptions.includes(option))
          throw new ApiError(
            "question",
            "The option object should have keys in form A, B, C and D",
            400
          );

        if (!options[option])
          throw new ApiError(
            "questions",
            `Please include an option in ${option}`,
            400
          );

        if (typeof options[option] !== "string")
          throw new ApiError("questions", "All options should be strings", 400);

        options[option] = options[option].trim();

        if (options[option].length > 256)
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
    }

    if (answer)
      if (!validOptions.includes(questionObj.answer))
        throw new ApiError(
          "questions",
          "The answer should be in form A, B, C or D",
          400
        );

    return { question, index, options, answer };
  });

  final.questions = questions;
}

function validateDescription(description: string, final: any) {
  if (typeof description !== "string")
    throw new ApiError(
      "description",
      "The description should be a string",
      400
    );

  if (description.length > 1024)
    throw new ApiError(
      "description",
      "The description should not exceed 1024 characters",
      400
    );

  final.description = description;
}
