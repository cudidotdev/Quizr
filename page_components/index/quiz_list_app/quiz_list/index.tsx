import React, { useEffect, useMemo, useRef, useState } from "react";
import ListContainer, { LinkList, List } from "components/lists";
import styles from "styles/pages/Home.module.css";
import { Text } from "components/texts";
import type { quizType2 as quiz } from "types/app";
import Pagination from "components/pagination";

const QuizList: React.FC<{ quizzes: quiz[] }> = ({ quizzes }) => {
  const [idx, setIdx] = useState(1);

  const maxPerPage = 6;
  const pages = Math.ceil(quizzes.length / maxPerPage);

  const $quizzes = useMemo(() => {
    const $: quiz[][] = new Array(pages).fill(0).map((n) => []);

    quizzes.forEach((quiz, idx) => {
      const n = Math.floor(idx / maxPerPage);
      const nn = idx % maxPerPage;
      $[n][nn] = quiz;
    });

    return $;
  }, [quizzes, pages]);

  useEffect(() => {
    setIdx(1);
  }, [quizzes]);

  return (
    <div style={{ padding: "0.75rem 0" }} className="content-width">
      <Text className={`${styles.QuizListHeading} t-medium`}>Quizzes</Text>

      <Pagination
        from={1}
        to={pages}
        idx={idx}
        setIdx={setIdx}
        style={{ marginBottom: "0.75rem" }}
      />

      {$quizzes.length ? (
        <ListContainer start={idx <= pages ? (idx - 1) * maxPerPage + 1 : 1}>
          {$quizzes[idx <= pages ? idx - 1 : 0].map((quiz) => (
            <LinkList key={quiz._id} href={`/q/${quiz.urlName}`}>
              <QuizBox {...quiz} />
            </LinkList>
          ))}
        </ListContainer>
      ) : (
        <Text
          style={{ color: "var(--color-primary-two)", textAlign: "center" }}
        >
          No quizzes found
        </Text>
      )}

      <Pagination
        from={1}
        to={pages}
        idx={idx}
        setIdx={setIdx}
        style={{ marginTop: "0.75rem" }}
      />
    </div>
  );
};

const QuizBox: React.FC<any> = ({ title, categories, averageScore }) => {
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
          Avg. Score:
          <span
            className={`${styles.Score} ${
              averageScore >= 5
                ? styles.A
                : averageScore !== undefined
                ? styles.B
                : ""
            }`}
          >
            {averageScore === undefined ? "-/-" : `${averageScore}/10`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizList;
