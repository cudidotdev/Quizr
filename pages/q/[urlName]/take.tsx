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
import { useState, useEffect } from "react";
import { patchFetcher } from "utils/fetchers";
import Head from "next/head";
import { useRouter } from "next/router";
import { serializeAnswers, storeInSession } from "utils/quiz";

const QuizTakePage: NextPageWithLayout = ({ quiz }: any) => {
  const { title, questions, _id: id, urlName } = quiz;
  const [idx, setIdx] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<any>();
  const [sheetId, setSheetId] = useState<string>();
  const [yAnswer, setYAnswer] = useState<{ [key: number]: ans }>({});
  const [pending, setPending] = useState<number[]>([]);
  const router = useRouter();

  async function chooseAnswer(answer: ans) {
    const index: number = idx;
    setYAnswer((prev) => {
      return { ...prev, [index]: answer };
    });
    setPending((prev) => [...prev, index]);

    const res = await patchFetcher(`/api/quiz/tick?id=${sheetId}`, {
      index,
      answer,
    });
    if (!res?.success) return;

    storeInSession({ index, answer }, urlName);
    setPending((prev) => prev.filter((i) => i != index));
  }

  /* eslint-disable */
  useEffect(() => {
    setCurrentQuestion(
      questions.find((question: any) => question.index === idx)
    );
  }, [idx]);

  useEffect(() => {
    (() => {
      const sheet = JSON.parse(sessionStorage.getItem(`quiz ${urlName}`)!);
      if (!sheet) return router.push(`/q/${urlName}`);

      setSheetId(sheet.id);
      setYAnswer((prev) => {
        return { ...serializeAnswers(sheet.answers), ...prev };
      });
    })();
  }, []);
  /* eslint-enable */

  return (
    <>
      <Header />
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
                colored={yAnswer[idx] === "A"}
              />
              <Option
                question={currentQuestion}
                value="B"
                onClick={() => chooseAnswer("B")}
                colored={yAnswer[idx] === "B"}
              />
              <Option
                question={currentQuestion}
                value="C"
                onClick={() => chooseAnswer("C")}
                colored={yAnswer[idx] === "C"}
              />
              <Option
                question={currentQuestion}
                value="D"
                onClick={() => chooseAnswer("D")}
                colored={yAnswer[idx] === "D"}
              />
            </div>
          </section>
          <section className={styles.NavigationBox}>
            <div className={styles.NextBtnBox}>
              <NextButton
                onClick={() => setIdx((prev) => (prev < 10 ? prev + 1 : 1))}
              />
            </div>
            <div>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <Nav
                  key={i}
                  idx={i}
                  setIdx={setIdx}
                  answered={!!yAnswer[i]}
                  pending={pending.includes(i)}
                />
              ))}
            </div>
            <div className={styles.SubmitBtnBox}>
              <SubmitButton />
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

  return { props: { quiz }, revalidate: 24 * 60 * 60 };
};

export default QuizTakePage;
