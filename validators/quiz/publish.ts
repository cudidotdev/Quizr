import ApiError from "errors/api";

export function validateQuiz(quiz: any) {
  const final: any = {};
  const { title, introText, categories, questions } = quiz;

  validateTitle(title, final);
  validateIntroText(introText, final);
  validateCategories(categories, final);
  validateQuestions(questions, final);

  return final;
}

function validateTitle(title: string, final: any) {
  if (!title)
    throw new ApiError("title", "A title for the quiz is required", 400);

  final.title = title;
}

function validateIntroText(introText: string, final: any) {
  if (!introText)
    throw new ApiError(
      "introText",
      "A introText for the quiz is required",
      400
    );

  final.introText = introText;
}

function validateCategories(categories: string[], final: any) {
  if (!categories || !categories.length)
    throw new ApiError(
      "categories",
      "Choose categories where the quiz belongs",
      400
    );

  final.categories = categories;
}

function validateQuestions(questions: any[], final: any) {
  if (questions.length !== 10)
    throw new ApiError(
      "questions",
      "The questions should be 10 in number",
      400
    );

  questions.forEach((questionObj) => {
    const { question, index, options, answer } = questionObj;

    if (!question)
      throw new ApiError(
        "questions",
        "A question text is required in all questions",
        400
      );
    if (!index)
      throw new ApiError(
        "questions",
        "An index is required in all questions",
        400
      );

    if (!options)
      throw new ApiError(
        "questions",
        "Four options are required in all questions",
        400
      );

    if (!answer)
      throw new ApiError(
        "questions",
        "All questions should have an answer",
        400
      );
  });

  final.questions = questions;
}
