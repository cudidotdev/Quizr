import { QuizDraft, Quiz, QuizSheet } from "database/models";
import { ScoreBoard } from "database/models";

export async function generateUniqueQuizTitle() {
  const Untitleds = await QuizDraft.find({
    title: { $regex: /^Untitled_\d+$/i },
  })
    .sort("-createdAt")
    .select("title -_id")
    .lean();
  if (!Untitleds.length) return "Untitled_1";
  console.log(Untitleds);

  const numOfLastUntitled = Untitleds.sort((a, b) => {
    const numA = a.title.match(/\d+$/)[0];
    const numB = b.title.match(/\d+$/)[0];

    return numA - numB;
  })
    .pop()
    .title.match(/\d+$/)[0];

  return `Untitled_${+numOfLastUntitled + 1}`;
}

export async function getQuizById(id: any, select: any = "") {
  return await Quiz.findById(id).select(select).lean();
}

export async function getQuizDraftById(id: any) {
  return await QuizDraft.findById(id).lean();
}

export async function getAllQuizes({
  sort = "",
  limit = 0,
  page = 1,
  select = "",
}: any) {
  page = page > 1 ? Math.floor(page) : 1;
  return await Quiz.find({})
    .sort(sort)
    .limit(+limit)
    .skip((page - 1) * limit)
    .select(select)
    .lean();
}

export async function getAllQuizDrafts({
  sort = "",
  limit = 0,
  page = 1,
}: any) {
  page = page > 1 ? Math.floor(page) : 1;
  return await QuizDraft.find({})
    .sort(sort)
    .limit(+limit)
    .skip((page - 1) * limit)
    .lean();
}

export async function modifyQuizDraft({ id, body }: { id: any; body: any }) {
  return await QuizDraft.findByIdAndUpdate(
    id,
    { ...body, lastModified: Date.now() },
    {
      new: true,
    }
  ).lean();
}

export async function gradeQuiz(uAnswers: any[], quizId: any) {
  let score = 0;

  const questions = (await Quiz.findById(quizId).select("questions").lean())
    .questions;

  const correction = questions.map((question: any) => {
    const final: any = {};
    const uAnswer = uAnswers.find((obj: any) => obj.index === question.index);

    final.index = question.index;
    final.question = question.question;

    if (uAnswer === undefined) final.correct = 0;
    else {
      if (uAnswer.answer === question.answer) {
        score++;
        final.correct = 1;
      } else {
        final.correct = -1;
      }
      final.uAnswer = {
        val: uAnswer.answer,
        text: question.options[uAnswer.answer],
      };
    }

    return final;
  });

  return { score, correction };
}

export async function submitQuiz(sheet: any, timeSubmited: number) {
  const { score, correction } = await gradeQuiz(sheet.answers, sheet.quizId);
  const quizTime = Math.min(
    Math.max(0, timeSubmited - sheet.timeStarted),
    10 * 60 * 1000
  );

  await ScoreBoard.create({
    user: sheet.userId,
    quiz: sheet.quizId,
    score,
    correction,
    quizTime,
  });
  await QuizSheet.findByIdAndUpdate(sheet._id, { submitted: true });

  return { score, correction };
}
