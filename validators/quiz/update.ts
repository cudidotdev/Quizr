import { Quiz, QuizDraft } from "database/models";
import ApiError from "errors/api";

export async function validateBody(body: any) {
  const final: any = {};
  const { title, categories, questions, introText, urlName } = body;

  if (title !== undefined) validateTitle(title, final);
  if (categories !== undefined) validateCategories(categories, final);
  if (questions !== undefined) validateQuestions(questions, final);
  if (introText !== undefined) validateIntroText(introText, final);
  if (urlName !== undefined) validateUrlName(urlName, final);

  return final;
}

function validateTitle(title: string, final: any) {
  if (typeof title !== "string")
    throw new ApiError("title", "The title should be a string");

  //removes extra white spaces in text
  title = title
    .split(" ")
    .filter((e) => e !== "")
    .join(" ");

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

  const prevCategoriesInserted: string[] = [];

  categories = categories
    .map((category) =>
      //removes extra white spaces in text
      category
        .split(" ")
        .filter((e) => e !== "")
        .join(" ")
    )
    .filter((category) =>
      //removes duplicates (case-insensitive) in categories array or empty text
      prevCategoriesInserted.some((c) =>
        //case-insensitive search
        new RegExp(`^${c}$`, "i").test(category)
      )
        ? false
        : category !== "" && prevCategoriesInserted.push(category)
    );

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
        throw new ApiError("questions", "The question should be a string");

      question = question.trim();

      if (question.length > 256)
        throw new ApiError(
          "questions",
          "Each question should be less than 256 characters",
          400
        );
    }

    if (options && index && !question) {
      throw new ApiError(
        "questions",
        `Please insert a text in question ${index}`,
        400
      );
    }

    if (index) {
      if (index < 1 || index > 10 || !Number.isInteger(index))
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
            "questions",
            "The option object should have keys in form A, B, C and D",
            400
          );

        if (!options[option])
          throw new ApiError(
            "questions",
            `Please insert a text in option ${option} of question ${index}`,
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

function validateIntroText(introText: string, final: any) {
  if (typeof introText !== "string")
    throw new ApiError(
      "description",
      "The description should be a string",
      400
    );

  introText = introText.trim();

  if (introText.length > 1024)
    throw new ApiError(
      "description",
      "The description should not exceed 1024 characters",
      400
    );

  final.introText = introText;
}

function validateUrlName(urlName: string, final: any) {
  if (typeof urlName !== "string")
    throw new ApiError("urlName", "The url name should be a string", 400);

  urlName = urlName.trim();

  if (urlName.length > 32)
    throw new ApiError(
      "urlName",
      "The url name should not be more than 32 characters",
      400
    );

  if (urlName.includes(" "))
    throw new ApiError("urlName", "The url name should contain no spaces", 400);

  final.urlName = urlName;
}
