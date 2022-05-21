import { quizType2, searchIndex } from "types/app";

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

export function setify(arr: (string | number)[]) {
  const setObj: { [key: string | number]: "" } = {};
  arr.forEach((e) => (setObj[e] = ""));
  return Object.keys(setObj);
}

export function indexQuizzes(quizzes: quizType2[]) {
  const DB: searchIndex = {};

  quizzes.forEach((quiz) => {
    const NameScoreMap = indexQuiz(quiz);

    for (let name in NameScoreMap) {
      DB[name] = DB[name]
        ? [...DB[name], { quizId: quiz._id, score: NameScoreMap[name] }]
        : [{ quizId: quiz._id, score: NameScoreMap[name] }];
    }
  });

  return DB;
}

function indexQuiz(quiz: quizType2) {
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
    question.question.split(" ").forEach((word) => index(word, 6));
    question.options.A.split(" ").forEach((word) => index(word, 1));
    question.options.B.split(" ").forEach((word) => index(word, 1));
    question.options.C.split(" ").forEach((word) => index(word, 1));
    question.options.D.split(" ").forEach((word) => index(word, 1));
  });

  return NameScoreMap;
}

export function searchQuizzes({
  searchWord,
  quizzes,
  searchIndex,
}: {
  searchWord: string;
  quizzes: quizType2[];
  searchIndex: searchIndex;
}) {
  if (!searchWord) return quizzes;

  const IdScoreMap: { [key: string]: number } = {};
  const IdRankMap: { [key: string]: number } = {};
  let maxScore: number = 0;
  let minScore: number = Infinity;

  for (let name in searchIndex) {
    const $searches = `^(${searchWord
      .split(" ")
      .filter((e) => e !== "")
      .join("|")})`;
    if (new RegExp($searches, "i").test(name)) {
      searchIndex[name].forEach(({ quizId: id, score }) => {
        IdScoreMap[id] = IdScoreMap[id] ? IdScoreMap[id] + score : score;
        maxScore = Math.max(IdScoreMap[id], maxScore);
        minScore = Math.min(IdScoreMap[id], minScore);
      });
    }
  }

  Object.entries(IdScoreMap)
    .filter((e) => e[1] > (maxScore - minScore) / 2)
    .sort((a, b) => b[1] - a[1])
    .forEach(([id], idx) => (IdRankMap[id] = idx));

  const ids = Object.keys(IdRankMap);
  const filterQuiz = quizzes.filter((quiz) => ids.includes(quiz._id));

  const newQuizzes: quizType2[] = [];
  filterQuiz.forEach((quiz) => (newQuizzes[IdRankMap[quiz._id]] = quiz));

  return newQuizzes;
}
