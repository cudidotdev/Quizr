import ListContainer, { LinkList } from "components/lists";
import React, { useEffect, useState } from "react";
import { getFetcher } from "utils/fetchers";
import QuizSortForm from "./quiz_sort_form";
import styles from "styles/pages/Home.module.css";
import aStyles from "styles/pages/Admin.module.css";
import { TripleSquareLoader } from "components/loaders";
import { ReloadIcon } from "components/icons";
import { Text } from "components/texts";

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
      <div style={{ padding: "0.75rem 0" }} className="content-width">
        <Text className={`${styles.QuizListHeading} t-medium`}>Quizzes</Text>
        {loading ? (
          <div className={aStyles.MsgContainer}>
            <p className={aStyles.LoaderBox}>
              Fetching quizzes
              <TripleSquareLoader colored />
            </p>
          </div>
        ) : quizLoadError.val ? (
          <div className={aStyles.MsgContainer}>
            <p className={aStyles.ErrorBox}>
              Couldn&apos;t fetch quizzes: {quizLoadError.msg}
            </p>
            <button className={aStyles.ReloadButton} onClick={fetchQuizzes}>
              Reload
              <span className={aStyles.Icon}>
                <ReloadIcon />
              </span>
            </button>
          </div>
        ) : (
          <ListContainer>
            {quizzes.map((quiz) => (
              <LinkList key={quiz._id} href={`/q/${quiz.urlName}`}>
                {quiz.title}
              </LinkList>
            ))}
          </ListContainer>
        )}
      </div>
    </div>
  );
};
export default QuizListApp;
