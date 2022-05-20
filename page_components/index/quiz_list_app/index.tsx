import React, { useEffect, useReducer, useState } from "react";
import { getFetcher } from "utils/fetchers";
import QuizSortForm from "./quiz_sort_form";
import QuizList from "./quiz_list";

export type query = {
  search: string;
  categories: string[];
  sort: string;
};

type quiz = {
  _id: string;
  title: string;
  categories: string[];
  questions: {
    question: string;
    index: number;
    option: { A: string; B: string; C: string; D: string };
  }[];
};

const QuizListApp: React.FC<{ quizzes: quiz[] }> = ({ quizzes }) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizLoadError, setQuizLoadError] = useState({ val: false, msg: "" });
  const [query, setQuery] = useState<query>({
    search: "",
    categories: [],
    sort: "Most Relevant",
  });

  async function fetchQuizzes() {
    setLoading(true);
    const res = await getFetcher("/api/quiz?select=title categories urlName");
    setLoading(false);

    if (!res)
      return setQuizLoadError({
        val: true,
        msg: "It seems there is a connection error",
      });

    const { success, data, error } = res;
    if (!success) return setQuizLoadError({ val: true, msg: error.message });

    setQuizLoadError({ val: false, msg: "" });
    setQuizzes(data);
  }

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="pad-bottom-one">
      <QuizSortForm query={query} setQuery={setQuery} />
      <QuizList
        loading={loading}
        quizLoadError={quizLoadError}
        fetchQuizzes={fetchQuizzes}
        quizzes={quizzes}
      />
    </div>
  );
};
export default QuizListApp;
