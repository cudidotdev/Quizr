import { QuizDraft, Quiz, QuizSheet, QuizSearchIndex } from "database/models";
import { ScoreBoard } from "database/models";
import { quiz, quizType2 } from "types/app";

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
  categories = "",
  search = "",
}: {
  [key: string]: string | number;
}) {
  let searchRanks: { [key: string]: number } = {};
  const sortMap: { [key: string]: string } = {
    ["Most Relevant"]: "numOfSubmission ",
    Hardest: "averageScore ",
    Easiest: "-averageScore ",
    ["A-Z"]: "title ",
    ["Z-A"]: "-title ",
  };

  page = page > 1 ? Math.floor(+page) : 1;
  limit = +limit;
  sort = sort
    .toString()
    .split(",")
    .map((s) => sortMap[s.trim()] || s)
    .join(" ");
  search = search.toString();
  categories = categories.toString();

  const query: any = {};

  if (search) {
    search = `^(${search
      .split(" ")
      .filter((e) => e !== "")
      .join("|")})`;
    const passed = await QuizSearchIndex.find({
      name: {
        $regex: new RegExp(search, "i"),
      },
    }).select("quizzes");

    const [ids, ranks] = calculateRanks(passed);
    query._id = { $in: ids };
    searchRanks = ranks;
  }

  if (categories) query.categories = { $in: categories.split(",") };

  const data = await Quiz.find(query)
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit)
    .select(select)
    .lean();

  if (search && sort.split(" ").includes("numOfSubmission"))
    return rankQuiz(data, searchRanks);
  return data;
}

function calculateRanks(data: any[]): [string[], { [key: string]: number }] {
  const IdScoreMap: { [key: string]: number } = {};
  const IdRankMap: { [key: string]: number } = {};
  let maxScore: number = 0;
  let minScore: number = Infinity;

  data.forEach((e) =>
    e.quizzes.forEach(({ quizId: id, score }: any) => {
      id = id.toString();
      IdScoreMap[id] = IdScoreMap[id] ? IdScoreMap[id] + score : score;
      maxScore = Math.max(IdScoreMap[id], maxScore);
      minScore = Math.min(IdScoreMap[id], minScore);
    })
  );

  Object.entries(IdScoreMap)
    .filter((e) => e[1] > (maxScore - minScore) / 2.5)
    .sort((a, b) => b[1] - a[1])
    .forEach(([id], idx) => (IdRankMap[id] = idx));

  return [Object.keys(IdRankMap), IdRankMap];
}

function rankQuiz(arg: any[], rankMap: any) {
  const newArr: any[] = [];

  arg.forEach((obj) => {
    newArr[rankMap[obj._id.toString()]] = obj;
  });

  return newArr;
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
    else if (uAnswer.answer === question.answer) {
      score++;
      final.correct = 1;
    } else {
      final.correct = -1;
    }

    final.answer = {
      val: question.answer,
      text: question.options[question.answer],
    };

    return final;
  });

  return { score, correction };
}

export async function submitQuiz(sheet: any, timeSubmited: number) {
  const { score, correction } = await gradeQuiz(sheet.answers, sheet.quizId);
  const quizTime = Math.min(
    Math.max(5 * 1000, timeSubmited - sheet.timeStarted),
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

  const quiz = await Quiz.findById(sheet.quizId);
  if (!quiz.timesTaken) quiz.timesTaken = quiz.averageScore = 0;

  quiz.averageScore =
    (quiz.averageScore * quiz.timesTaken + score) / ++quiz.timesTaken;
  await quiz.save();

  return { score, correction };
}

export async function indexQuiz(quiz: quizType2, isNew: boolean) {
  const { title, categories, questions } = quiz;
  const NameScoreMap: { [key: string]: number } = {};

  function index(name: string, score: number) {
    if (
      /^(the|are|was|were|this|that|these|those|what|why|whose|which|who|how|there)$/i.test(
        name
      ) ||
      name.length < 3
    )
      score = 0.1;

    name = name.match(/\w+/g)!?.join();
    if (!name) return;

    const lName = name.toLowerCase();
    if (lName in NameScoreMap)
      NameScoreMap[lName] = NameScoreMap[lName] + score;
    else NameScoreMap[lName] = score;
  }

  title.split(" ").forEach((word) => index(word, 12));
  categories.forEach((category) =>
    category.split(" ").forEach((word) => index(word, 10))
  );
  questions.forEach((question) => {
    question.question.split(" ").forEach((word) => index(word, 4));
    question.options.A.split(" ").forEach((word) => index(word, 1));
    question.options.B.split(" ").forEach((word) => index(word, 1));
    question.options.C.split(" ").forEach((word) => index(word, 1));
    question.options.D.split(" ").forEach((word) => index(word, 1));
  });

  if (!isNew) {
    await QuizSearchIndex.updateMany(
      {},
      { $pull: { quizzes: { quizId: quiz._id } } }
    );
  }

  async function insert(name: string) {
    await QuizSearchIndex.findOneAndUpdate(
      { name },
      {
        $push: { quizzes: { quizId: quiz._id, score: NameScoreMap[name] } },
      },
      { upsert: true }
    );
  }

  for (let name in NameScoreMap) {
    insert(name);
  }
}
