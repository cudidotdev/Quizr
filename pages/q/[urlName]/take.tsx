import type { NextPageWithLayout } from "types/next";
import { Header, Option, Nav } from "page_components/q";
import styles from "styles/pages/Q.module.css";
import { GetStaticPaths, GetStaticProps } from "next";
import connectDB from "database/connect";
import { Quiz } from "database/models";
import type { quiz } from "types/app";
import { useState, useEffect } from "react";

const QuizTakePage: NextPageWithLayout = ({ quiz }: any) => {
  const { title, questions, _id: id } = quiz;
  const [idx, setIdx] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<any>();

  /* eslint-disable */
  useEffect(() => {
    setCurrentQuestion(
      questions.find((question: any) => question.index === idx)
    );
  }, [idx]);
  /* eslint-enable */

  return (
    <>
      <Header />
      <main className="content-width" style={{ padding: "1rem" }}>
        <h1 className={`${styles.QuizTitle} t-medium`}>{title}</h1>
        <section>
          <p className={styles.Question}>
            <span className={styles.Index}>{currentQuestion?.index}</span>
            <p className={styles.Text}>{currentQuestion?.question}</p>
          </p>
          <div className={styles.OptionBox}>
            <Option question={currentQuestion} value="A" />
            <Option question={currentQuestion} value="B" />
            <Option question={currentQuestion} value="C" />
            <Option question={currentQuestion} value="D" />
          </div>
        </section>
        <section className={styles.NavigationBox}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Nav key={i} idx={i} setIdx={setIdx} />
          ))}
        </section>
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
    .select("title questions")
    .lean();
  if (!quiz) return { notFound: true };

  quiz._id = quiz._id.toString();
  quiz.questions.forEach((question) => delete question.answer);

  return { props: { quiz }, revalidate: 24 * 60 * 60 };
};

export default QuizTakePage;
