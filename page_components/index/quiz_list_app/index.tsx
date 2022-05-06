import React, { useEffect, useState } from "react";
import { getFetcher } from "utils/fetchers";
import QuizSortForm from "./quiz_sort_form";
import QuizList from "./quiz_list";

const QuizListApp: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizLoadError, setQuizLoadError] = useState({ val: false, msg: "" });

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
      <QuizSortForm />
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
