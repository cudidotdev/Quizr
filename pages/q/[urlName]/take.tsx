import type { NextPageWithLayout } from "types/next";
import { Header, Option, Nav, NextButton } from "page_components/q";
import styles from "styles/pages/Q.module.css";
import { GetStaticPaths, GetStaticProps } from "next";
import connectDB from "database/connect";
import { Quiz } from "database/models";
import type { quiz } from "types/app";
import { useState, useEffect } from "react";
import { patchFetcher } from "utils/fetchers";

type ans = "A" | "B" | "C" | "D";

const QuizTakePage: NextPageWithLayout = ({ quiz }: any) => {
  const { title, questions, _id: id, urlName } = quiz;
  const [idx, setIdx] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<any>();
  const [sheetId, setSheetId] = useState<string>();
  const [yAnswer, setyAnswer] = useState<{ [key: number]: ans }>({});

  async function chooseAnswer(answer: ans) {
    setyAnswer((prev) => {
      return { ...prev, [idx]: answer };
    });
    await patchFetcher(`/api/quiz/tick?id=${sheetId}`, { index: idx, answer });
  }

  /* eslint-disable */
  useEffect(() => {
    setCurrentQuestion(
      questions.find((question: any) => question.index === idx)
    );
  }, [idx]);

  useEffect(() => {
    setSheetId(sessionStorage.getItem(`quiz ${urlName}`) || "");
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
                <Nav key={i} idx={i} setIdx={setIdx} />
              ))}
            </div>
          </section>
        </div>
      </main>
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
