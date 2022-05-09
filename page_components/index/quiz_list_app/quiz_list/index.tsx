import React, { useEffect, useState } from "react";
import ListContainer, { LinkList, List } from "components/lists";
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
        <ListContainer>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <List key={n}>
              <QuizLoadingComponent />
            </List>
          ))}
        </ListContainer>
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
              <QuizBox {...quiz} />
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

const QuizLoadingComponent: React.FC = () => {
  return (
    <div className={styles.QuizLoadingContainer}>
      <div className={styles.Title}></div>
      <div className={styles.Categories}>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <span key={n}></span>
        ))}
      </div>
      <div className={styles.ScoreBox}>
        <div>
          Avg. Score:<span></span>
        </div>
      </div>
    </div>
  );
};

const QuizBox: React.FC<any> = ({ title, categories }) => {
  return (
    <div className={styles.QuizBox}>
      <div className={styles.Title}>{title}</div>
      <div className={styles.Categories}>
        {categories.map((category: any) => (
          <span key={category}>{category}</span>
        ))}
      </div>
      <div className={styles.ScoreBox}>
        <div>
          Avg. Score:<span className={styles.Score}>6/10</span>
        </div>
      </div>
    </div>
  );
};

export default QuizList;
