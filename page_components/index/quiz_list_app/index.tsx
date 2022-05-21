import React, { useEffect, useReducer, useState } from "react";
import QuizSortForm from "./quiz_sort_form";
import QuizList from "./quiz_list";
import type { quizType2 as quiz, searchIndex } from "types/app";
import { indexQuizzes, searchQuizzes, setify } from "utils";

const QuizListApp: React.FC<{ quizzes: quiz[] }> = ({ quizzes }) => {
  const [query, setQuery] = useState<query>({
    search: "",
    categories: [],
    sort: "Most Relevant",
  });
  const [quizCategories, setQuizCategories] = useState<string[]>([]);
  const [$quizzes, set$quizzes] = useState(quizzes);
  const [quizSearchIndex, setQuizSearchIndex] = useState<searchIndex>();

  /*eslint-disable*/
  useEffect(() => {
    const arr: string[] = [];
    quizzes.forEach((q) =>
      q.categories.forEach((category) => arr.push(category))
    );
    setQuizCategories(setify(arr).sort());

    setQuizSearchIndex(indexQuizzes(quizzes));
  }, [quizzes]);

  useEffect(() => {
    let $1, $2, $3; //pipelines

    $1 = searchQuizzes({
      searchWord: query.search,
      quizzes,
      searchIndex: quizSearchIndex || {},
    });

    $2 = $1.filter((q) => {
      if (query.categories.length)
        return q.categories.some((category) =>
          query.categories.includes(category)
        );
      return true;
    });

    $3 = $2.sort((a, b) => {
      if (query.sort === "A-Z")
        return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
      if (query.sort === "Z-A")
        return a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1;
      return 0;
    });

    set$quizzes($3);
  }, [query]);
  /*eslint-enable*/

  return (
    <div className="pad-bottom-one">
      <QuizSortForm
        query={query}
        setQuery={setQuery}
        categories={quizCategories}
      />
      <QuizList quizzes={$quizzes} />
    </div>
  );
};

export default QuizListApp;

export type query = {
  search: string;
  categories: string[];
  sort: string;
};
