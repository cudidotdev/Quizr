import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { Intro, QuizListApp } from "page_components/index";
import { GetServerSideProps, GetStaticProps } from "next";
import { Quiz } from "database/models";
import connectDB from "database/connect";
import type { quizType2 as quiz } from "types/app";

const Home: NextPageWithLayout = (props: any) => {
  const quizzes: quiz[] = props.quizzes;

  return (
    <main className="site-width pad-one">
      <Intro />
      <QuizListApp quizzes={quizzes} />
    </main>
  );
};

Home.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async () => {
  await connectDB();

  const quizzes = await Quiz.find()
    .select("title categories questions urlName averageScore timesTaken")
    .lean();
  quizzes.forEach((q) => {
    q._id = q._id.toString();
    q.questions.forEach((ques: any) => delete ques.answer);
  });

  return { props: { quizzes } };
};

export default Home;
