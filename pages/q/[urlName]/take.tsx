import type { NextPageWithLayout } from "types/next";
import { Header } from "page_components/q";
import { TextS } from "components/texts";
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

  useEffect(() => {
    setCurrentQuestion(
      questions.find((question: any) => question.index === idx)
    );
  }, [idx, questions]);

  return (
    <>
      <Header />
      <main className="content-width" style={{ padding: "1rem" }}>
        <h1 className={`${styles.QuizTitle} t-medium`}>
          <TextS>{title}</TextS>
        </h1>
        <section>
          <p className={styles.Question}>
            <span className={styles.Index}>{currentQuestion?.index}</span>
            <p className={styles.Text}>{currentQuestion.question}</p>
          </p>
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
