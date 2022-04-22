export type page = "overview" | "quizzes" | "drafts" | "users" | "stats";

export type question = {
  question: string;
  index: number;
  options: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
};

export type draftData = {
  title?: string;
  categories?: string;
  introText?: string;
  questions?: question[];
};

export type draftAction =
  | {
      type: "title" | "categories" | "introText";
      payload: "string";
    }
  | {
      type: "questions";
      payload: question;
    }
  | {
      type: "all";
      payload: draftData;
    };
