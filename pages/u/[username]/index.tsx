import { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import connectDB from "database/connect";
import { ScoreBoard, User } from "database/models";
import { useEffect, useLayoutEffect, useState } from "react";
import { getFetcher } from "utils/fetchers";
import Profile from "page_components/u";
import { QuizzesTakenComponent } from "page_components/u";
import Head from "next/head";

const ProfilePage: NextPageWithLayout = ({ user, scores }: any) => {
  const [width, setWidth] = useState(0);

  function resizeWidth() {
    setWidth(window.innerWidth);
  }

  useLayoutEffect(() => {
    resizeWidth();
    window.addEventListener("resize", resizeWidth);
  }, []);

  return (
    <main className="content-width pad-one">
      <Profile user={user} width={width} page="home" />
      <QuizzesTakenComponent scores={scores} />
      <Head>
        <title>{user?.username}: Quizr</title>
      </Head>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await connectDB();
  let user;

  if (params!.username)
    user = await User.findOne({ username: params?.username })
      .select("-createdAt")
      .lean();

  if (!user) return { notFound: true };

  user._id = user._id.toString();
  const rank =
    (await User.find({ EXP: { $gt: user.EXP } }).select("EXP")).length + 1;
  user.rank = rank;

  const scores = await ScoreBoard.find({ user: user._id })
    .populate("quiz", "title timesTaken averageScore urlName -_id")
    .select("-correction -dateSubmitted -user -_id")
    .lean();
  scores.sort((a: any, b: any) =>
    a.quiz.title.toLowerCase() < b.quiz.title.toLowerCase() ? -1 : 1
  );

  return { props: { user, scores } };
};

ProfilePage.Layout = Layout;
export default ProfilePage;
