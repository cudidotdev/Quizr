import ListContainer, { LinkList } from "components/lists";
import React, { useEffect, useState } from "react";
import { getFetcher } from "utils/fetchers";
import QuizSortForm from "./quiz_sort_form";

const QuizListApp: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  async function fetchQuizzes() {
    const res = await getFetcher("/api/quiz");
    const { success, data, error } = res;

    if (!res) return console.error("connection error");
    if (!success) return console.error(error.message);

    setQuizzes(data);
  }

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="pad-bottom-one">
      <QuizSortForm />
      <div style={{ padding: "0.75rem 0" }} className="content-width">
        <ListContainer>
          {quizzes.map((quiz) => (
            <LinkList key={quiz._id}>{quiz.title}</LinkList>
          ))}
        </ListContainer>
      </div>
    </div>
  );
};
export default QuizListApp;
