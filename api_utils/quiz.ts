import { QuizDraft, Quiz } from "database/models";

export async function generateUniqueQuizTitle() {
  const Untitleds = await QuizDraft.find({
    $regex: { title: /^Untitled_\d+$/i },
  })
    .sort("-createdAt")
    .select("title -_id")
    .lean();
  if (!Untitleds.length) return "Untitled_1";

  const numOfLastUntitled = Untitleds.sort((a, b) => {
    const numA = a.title.match(/\d+$/)[0];
    const numB = b.title.match(/\d+$/)[0];

    return numA - numB;
  })
    .pop()
    .title.match(/\d+$/)[0];

  return `Untitled_${+numOfLastUntitled + 1}`;
}

export async function getQuizById(id: any) {
  return await Quiz.findById(id).lean();
}

export async function getQuizDraftById(id: any) {
  return await QuizDraft.findById(id).lean();
}

export async function getAllQuizes({ sort = "", limit = 0, page = 1 }: any) {
  page = page > 1 ? Math.floor(page) : 1;
  return await Quiz.find({})
    .sort(sort)
    .limit(+limit)
    .skip((page - 1) * limit)
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
