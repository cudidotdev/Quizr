import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { NotePadContext } from "components/app";
import styles from "styles/pages/Q.module.css";
import { getFetcher } from "utils/fetchers";
import Pagination from "components/pagination";
import Head from "next/head";
import Image from "next/image";
import ListContainer, { LinkList, List } from "components/lists";
import { modifyTimeForDisplay } from "utils";
import { calculateEXP } from "utils/quiz";

const QuizEndPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [resultLoading, setResultLoading] = useState(true);
  const addNote = useContext(NotePadContext);
  const [result, setResult] = useState<any>();
  const [resultError, setResultError] = useState<string>();

  async function getResult() {
    const { urlName, user } = router.query;

    let url = `/api/quiz/result?urlName=${urlName}`;
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
    <>
      <main className={`site-width pad-one`}>
        <div className={styles.ResultLeaderBoardBox}>
          <div>
            {resultLoading ? (
              <FallBack />
            ) : result ? (
              <Result result={result} />
            ) : (
              <NoResult error={resultError} />
            )}
          </div>
          <div>
            <LeaderBoards />
          </div>
        </div>
      </main>
      <Head>
        <title>Result page: Quizr</title>
      </Head>
    </>
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
            <span style={{ fontStyle: "italic" }}>{obj.answer.val}:</span>
            <span style={{ marginLeft: "0.75rem", fontStyle: "italic" }}>
              {obj.answer.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const NoResult: React.FC<any> = ({ error }) => {
  return (
    <div className={`${styles.ResultContainer}`}>
      <div className={styles.ScoreBox}>Score: -/10</div>
      <div className={styles.ErrorBox}>{error}</div>
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
            <span className={styles.Side}>
              <span></span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const LeaderBoards: React.FC = () => {
  const [idx, setIdx] = useState(1);
  const [error, setError] = useState<string>();
  const [quizId, setQuizId] = useState<string>();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const maxPerPage = 5;
  const pages = Math.ceil(scores.length / maxPerPage);
  const $scores = useMemo(() => {
    const $: any[][] = new Array(pages).fill(0).map((n) => []);

    scores.forEach((score, idx) => {
      const n = Math.floor(idx / maxPerPage);
      const nn = idx % maxPerPage;
      $[n][nn] = score;
    });

    return $;
  }, [scores, pages]);

  async function getQuizId(urlName: any) {
    const res = await getFetcher(`/api/quiz?urlName=${urlName}&select=_id`);
    if (!res) return setError("It seems there is no internet connection");

    const { success, data, error } = res;
    if (!success) return setError(error.message);

    setQuizId(data?._id);
  }

  async function getScores(quizId: string) {
    const res = await getFetcher(`/api/quiz/scores?qId=${quizId}`);
    if (!res) return setError("It seems there is no internet connection");

    const { success, data, error } = res;
    if (!success) return setError(error.message);

    setLoading(false);
    setScores(
      data.sort(
        (a: any, b: any) =>
          calculateEXP(b.score, b.quizTime) - calculateEXP(a.score, a.quizTime)
      )
    );
  }

  useEffect(() => {
    if (quizId) getScores(quizId);
  }, [quizId]);

  useEffect(() => {
    if (router.query.urlName) getQuizId(router.query.urlName);
  }, [router]);

  return (
    <div className={styles.LeaderBoard}>
      <h2 className={`${styles.Title} t-regular`}>LEADERBOARD</h2>
      <Pagination from={1} to={pages} idx={idx} setIdx={setIdx} />
      {loading ? (
        <LeaderBoardsFallBack />
      ) : $scores.length ? (
        <ScoreContainer
          scores={$scores[idx - 1]}
          start={(idx - 1) * maxPerPage + 1}
        />
      ) : (
        <></>
      )}
      <Pagination from={1} to={pages} idx={idx} setIdx={setIdx} />
    </div>
  );
};

const ScoreContainer: React.FC<any> = ({ scores, start }) => {
  return (
    <ListContainer start={start}>
      {scores.map((score: any, idx: any) => (
        <LinkList href={`/u/${score.user.username}`} key={idx}>
          <div className={`${styles.ScoreBox} t-mono`}>
            <div className={styles.DP}>
              <Image
                src={score.user.profilePicture}
                alt={`${score.user.username} profilePicture`}
                width="100%"
                height="100%"
              />
            </div>
            <div>
              <div className={styles.Username}>{score.user.username}</div>
              <div className={`${styles.ST} `}>Score:&ensp;{score.score}</div>
              <div className={`${styles.ST} `}>
                Time:&ensp;
                {modifyTimeForDisplay(score.quizTime)}
              </div>
              <div className={`${styles.EXPBox}`}>
                +{calculateEXP(score.score, score.quizTime)} EXP
              </div>
            </div>
          </div>
        </LinkList>
      ))}
    </ListContainer>
  );
};

const LeaderBoardsFallBack: React.FC = () => (
  <ListContainer className={styles.FallBack}>
    {new Array(10).fill(0).map((e, idx) => (
      <List key={idx}>
        <div className={`${styles.Container} t-mono`}>
          <div className={`${styles.DP} ${styles.Blink}`}></div>
          <div>
            <div className={`${styles.Username} ${styles.Blink}`}></div>
            <div className={`${styles.ST} ${styles.Blink}`}>Score</div>
            <div className={`${styles.ST} ${styles.Blink}`}>Time</div>
            <div className={`${styles.EXPBox} ${styles.Blink}`}></div>
          </div>
        </div>
      </List>
    ))}
  </ListContainer>
);

QuizEndPage.Layout = Layout;

export default QuizEndPage;
