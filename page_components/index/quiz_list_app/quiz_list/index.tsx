import React, { useEffect, useState } from "react";
import ListContainer, { LinkList } from "components/lists";
import { getFetcher } from "utils/fetchers";
import styles from "styles/pages/Home.module.css";
import aStyles from "styles/pages/Admin.module.css";
import { TripleSquareLoader } from "components/loaders";
import { ReloadIcon } from "components/icons";
import { Text } from "components/texts";

const QuizList: React.FC<quizListProps> = ({
  loading,
  quizLoadError,
  fetchQuizzes,
  quizzes,
}) => {
  return (
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
  );
};

type quizListProps = {
  loading: boolean;
  quizLoadError: { val: boolean; msg: string };
  fetchQuizzes: () => any;
  quizzes: any[];
};

export default QuizList;
