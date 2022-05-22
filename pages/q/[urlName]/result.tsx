import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { NotePadContext } from "components/app";
import styles from "styles/pages/Q.module.css";
import { getFetcher } from "utils/fetchers";
import { Text } from "components/texts";

const QuizEndPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [resultLoading, setResultLoading] = useState(true);
  const addNote = useContext(NotePadContext);
  const [result, setResult] = useState<any>();
  const [resultError, setResultError] = useState<string>();

  async function getResult() {
    const { urlName, user } = router.query;

    let url = `/api/quiz/fetch_score?urlName=${urlName}`;
    if (user) url = url.concat(`&user=${user}`);

    const res = await getFetcher(url);

    if (!res)
      return addNote({
        id: `not resolved /q${urlName}/result`,
        msg: `It seems you have no internet connection`,
        type: "error",
      });

    const { success, data, error } = res;
    if (!success) {
      addNote({
        id: `error /q/${urlName}/result`,
        msg: error.message,
        type: "error",
      });
      if (error.name === "login") router.push(`/in?next=/q/${urlName}/result`);
      setResultError(error.message);
      setResultLoading(false);
      return;
    }
    data.correction.sort((a: any, b: any) => a.index - b.index);
    setResult(data);
    setResultLoading(false);
  }

  /*eslint-disable*/
  useEffect(() => {
    if (router.query.urlName) getResult();
  }, [router]);
  /*eslint-enable*/

  return (
    <main className={`site-width pad-one`}>
      <div className={styles.ResultLeaderBoardBox}>
        <div>
          {resultLoading ? (
            <FallBack />
          ) : result ? (
            <Result result={result} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
};

const Result: React.FC<{ result: any }> = ({ result }) => {
  const { score } = result;
  return (
    <div className={`${styles.ResultContainer}`}>
      <div
        className={`${styles.ScoreBox} ${score > 5 ? styles.High : styles.Low}`}
      >
        Score: {score}/10
      </div>
      {result.correction.map((obj: any) => (
        <div
          key={obj.index}
          className={`${styles.ResultBox} ${
            obj.correct == 1 ? styles.A : obj.correct == 0 ? styles.B : styles.C
          }`}
        >
          <div className={styles.Index}>{obj.index}</div>
          <div className={styles.Child}>
            <div className={styles.QuestionText}>{obj.question}</div>
            <span>{obj.answer.val}:</span>
            <span style={{ marginLeft: "0.75rem", fontStyle: "italic" }}>
              {obj.answer.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const FallBack: React.FC = () => {
  return (
    <div className={`${styles.ResultContainer} ${styles.FallBack}`}>
      <div className={styles.ScoreBox}>
        Score: <span></span>
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <div key={n} className={styles.ResultBox}>
          <div className={styles.Index}>{n}</div>
          <div className={styles.Child}>
            <span></span>
            <span></span>
            <span className={styles.Side}>
              <span></span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

QuizEndPage.Layout = Layout;

export default QuizEndPage;
