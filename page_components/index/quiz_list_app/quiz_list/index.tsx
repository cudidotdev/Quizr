import React, { useEffect, useMemo, useRef, useState } from "react";
import ListContainer, { LinkList, List } from "components/lists";
import styles from "styles/pages/Home.module.css";
import { Text } from "components/texts";
import type { quizType2 as quiz } from "types/app";

const QuizList: React.FC<{ quizzes: quiz[] }> = ({ quizzes }) => {
  const [idx, setIdx] = useState(0);

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
    setIdx(0);
  }, [quizzes]);

  return (
    <div style={{ padding: "0.75rem 0" }} className="content-width">
      <Text className={`${styles.QuizListHeading} t-medium`}>Quizzes</Text>

      {$quizzes.length ? (
        <>
          <PaginationBox
            $quizzes={$quizzes}
            idx={idx}
            setIdx={setIdx}
            style={{ marginTop: 0 }}
          />

          <ListContainer start={idx < pages ? idx * maxPerPage + 1 : 1}>
            {$quizzes[idx < pages ? idx : 0].map((quiz) => (
              <LinkList key={quiz._id} href={`/q/${quiz.urlName}`}>
                <QuizBox {...quiz} />
              </LinkList>
            ))}
          </ListContainer>

          <PaginationBox $quizzes={$quizzes} idx={idx} setIdx={setIdx} />
        </>
      ) : (
        <p>No quizzes</p>
      )}
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

const PaginationBox: React.FC<{
  $quizzes: quiz[][];
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
  style?: React.CSSProperties;
}> = ({ $quizzes, idx, setIdx, style }) => (
  <div className={styles.PaginationBox} style={style}>
    {$quizzes.map((e, index) => (
      <span
        key={index}
        onClick={() => setIdx(index)}
        className={idx === index ? styles.Active : ""}
      >
        {index + 1}
      </span>
    ))}
  </div>
);

export default QuizList;
