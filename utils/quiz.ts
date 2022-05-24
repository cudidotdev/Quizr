import type { ans } from "types/app";

export function modifyDraftForDisplay(data: any) {
  if (Array.isArray(data.categories))
    return { ...data, categories: data.categories.join(", ") };
  return data;
}

export function modifyDraftForSave(data: any) {
  if (typeof data.categories === "string")
    return { ...data, categories: data.categories.split(",") };
  return data;
}

export function removeQuizSessions() {
  const sessionKeys = Object.keys(sessionStorage);

  sessionKeys.forEach((key) => {
    if (key.match(/^quiz.*/)) {
      sessionStorage.removeItem(key);
    }
  });
}

export function serializeAnswers(answers: any[]) {
  const obj: { [key: number]: ans } = {};

  answers.forEach((answer) => {
    obj[answer.index] = answer.answer;
  });

  return obj;
}

export function storeInSession(body: any, urlName: string) {
  const sheet = JSON.parse(sessionStorage.getItem(`quiz ${urlName}`)!);

  if (sheet.answers.some((obj: any) => obj.index == body.index))
    sheet.answers = sheet.answers.map((obj: any) =>
      obj.index === body.index ? body : obj
    );
  else sheet.answers.push(body);

  sessionStorage.setItem(
    `quiz ${urlName}`,
    JSON.stringify({
      ...sheet,
    })
  );
}

export function calculateEXP(score: number, quizTime: number) {
  return Number(((score * 60 * 1000) / quizTime).toFixed(2));
}
