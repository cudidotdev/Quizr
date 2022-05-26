import type { NextPageWithLayout } from "types/next";
import {
  Header,
  Option,
  Nav,
  NextButton,
  SubmitButton,
} from "page_components/q";
import styles from "styles/pages/Q.module.css";
import { GetStaticPaths, GetStaticProps } from "next";
import connectDB from "database/connect";
import { Quiz } from "database/models";
import type { ans, quiz } from "types/app";
import { useState, useEffect, useContext } from "react";
import { getFetcher, patchFetcher, postFetcher } from "utils/fetchers";
import Head from "next/head";
import { useRouter } from "next/router";
import { serializeAnswers, storeInSession } from "utils/quiz";
import { NotePadContext, UserContext } from "components/app";

const QuizTakePage: NextPageWithLayout = ({ quiz }: any) => {
  const { title, questions, _id: id, urlName } = quiz;
  const [idx, setIdx] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<any>();
  const [sheetId, setSheetId] = useState<string>();
  const [uAnswer, SetUAnswer] = useState<{ [key: number]: ans }>({});
  const [pending, setPending] = useState<number[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<null | {
    type: "info" | "error";
    name?: string;
    msg: string;
  }>(null);
  const router = useRouter();
  const [user] = useContext(UserContext);
  const addNote = useContext(NotePadContext);

  async function chooseAnswer(answer: ans) {
    const index: number = idx;
    SetUAnswer((prev) => {
      return { ...prev, [index]: answer };
    });
    setPending((prev) => [...prev, index]);

    setSubmitMsg(null);

    const res = await patchFetcher(`/api/quiz/tick?id=${sheetId}`, {
      index,
      answer,
    });
    setPending((prev) => prev.filter((i) => i != index));

    if (!res) {
      addNote({
        type: "error",
        id: `tickerrori${urlName}`,
        msg: "It seems there is no internet connection",
      });
      SetUAnswer((prev) => {
        return serializeAnswers(
          JSON.parse(sessionStorage.getItem(`quiz ${urlName}`)!).answers
        );
      });
      if (!submitLoading) setPending([]);
      return;
    }

    const { success, error } = res;

    if (!success) {
      if (error.name === "time") {
        addNote({
          type: "error",
          id: `tickerror${urlName}`,
          msg: error.message,
        });
        sessionStorage.removeItem(`quiz ${urlName}`);
        return router.push(`/q/${urlName}/result`);
      }
      if (error.name === "sheet") {
        addNote({
          type: "error",
          id: `tickerror${urlName}`,
          msg: error.message,
        });
        sessionStorage.removeItem(`quiz ${urlName}`);
        return router.push(`/q/${urlName}`);
      }
    }

    SetUAnswer((prev) => {
      return { ...prev, [index]: answer };
    });
    storeInSession({ index, answer }, urlName);
  }

  async function submitQuiz(force = false) {
    setSubmitLoading(true);

    const totalAnswerd = Object.keys(uAnswer).length;
    if (totalAnswerd < 10 && !force) {
      setSubmitLoading(false);
      setSubmitMsg({
        type: "error",
        name: "not finished",
        msg: `You have ${10 - totalAnswerd} unanswered questions`,
      });
      return;
    }

    if (pending.length) {
      setSubmitMsg({ type: "info", msg: "Waiting for answers to tick" });
      return;
    }

    const res = await postFetcher(`/api/quiz/submit?id=${sheetId}`, {});
    setSubmitLoading(false);

    if (!res)
      return setSubmitMsg({
        type: "error",
        msg: "It seems there is no internet connection",
      });

    const { success, data, error } = res;
    if (!success) return setSubmitMsg({ type: "error", msg: error.message });

    setSubmitMsg(null);
    sessionStorage.removeItem(`quiz ${urlName}`);
    router.push(`/q/${urlName}/result`);
  }

  /* eslint-disable */
  useEffect(() => {
    setCurrentQuestion(
      questions.find((question: any) => question.index === idx)
    );
  }, [idx]);

  useEffect(() => {
    (async () => {
      if (!pending.length && submitLoading) await submitQuiz();
    })();
  }, [pending]);

  useEffect(() => {
    (async () => {
      const sheet = JSON.parse(sessionStorage.getItem(`quiz ${urlName}`)!);
      if (!sheet || !user) return router.push(`/q/${urlName}`);

      setSheetId(sheet.id);
      SetUAnswer((prev) => {
        return { ...serializeAnswers(sheet.answers), ...prev };
      });
    })();
    router.prefetch(`/q/${urlName}`);
    router.prefetch(`/q/${urlName}/result`);
  }, []);
  /* eslint-enable */

  return (
    <>
      <Header urlName={urlName} submitFn={() => submitQuiz(true)} />
      <main className="content-width" style={{ padding: "1rem" }}>
        <div className={styles.QuizBoard}>
          <h1 className={`${styles.QuizTitle} t-regular`}>{title}</h1>
          <section>
            <p className={styles.Question}>
              <span className={styles.Index}>{currentQuestion?.index}</span>
              <span className={styles.Text}>{currentQuestion?.question}</span>
            </p>
            <div className={styles.OptionBox}>
              <Option
                question={currentQuestion}
                value="A"
                onClick={() => chooseAnswer("A")}
                colored={uAnswer[idx] === "A"}
              />
              <Option
                question={currentQuestion}
                value="B"
                onClick={() => chooseAnswer("B")}
                colored={uAnswer[idx] === "B"}
              />
              <Option
                question={currentQuestion}
                value="C"
                onClick={() => chooseAnswer("C")}
                colored={uAnswer[idx] === "C"}
              />
              <Option
                question={currentQuestion}
                value="D"
                onClick={() => chooseAnswer("D")}
                colored={uAnswer[idx] === "D"}
              />
            </div>
          </section>
          <section className={styles.NavigationBox}>
            <div>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <Nav
                  key={i}
                  idx={i}
                  setIdx={setIdx}
                  answered={!!uAnswer[i]}
                  pending={pending.includes(i)}
                />
              ))}
            </div>
            <div className={styles.NextBtnBox}>
              <NextButton
                onClick={() => setIdx((prev) => (prev < 10 ? prev + 1 : 1))}
              />
            </div>
            <div
              className={styles.SubmitBtnBox}
              style={{ cursor: `${submitLoading ? "progress" : "default"}` }}
            >
              {!!submitMsg && (
                <p
                  className={`${
                    submitMsg.type === "error" ? styles.Error : styles.Info
                  }`}
                >
                  {submitMsg.msg}
                  {submitMsg.name === "not finished" && (
                    <>
                      ,{" "}
                      <span
                        className={styles.Link}
                        onClick={() => submitQuiz(true)}
                      >
                        submit anyway?
                      </span>
                    </>
                  )}
                </p>
              )}
              <SubmitButton
                loading={submitLoading}
                onClick={() => submitQuiz()}
              />
            </div>
          </section>
        </div>
      </main>
      <Head>
        <title>Quiz: {title}</title>
      </Head>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  await connectDB();

  const paths = (await Quiz.find({}).select("urlName -_id")).map((quiz) => {
    return { params: quiz };
  });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await connectDB();

  const quiz: quiz = await Quiz.findOne({ urlName: params!.urlName })
    .select("title questions urlName")
    .lean();
  if (!quiz) return { notFound: true };

  quiz._id = quiz._id.toString();
  quiz.questions.forEach((question) => delete question.answer);

  return { props: { quiz }, revalidate: 30 * 60 };
};

export default QuizTakePage;
