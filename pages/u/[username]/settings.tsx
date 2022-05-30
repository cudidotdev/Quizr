import { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import connectDB from "database/connect";
import { User } from "database/models";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { UserContext } from "components/app";
import NotFoundComponent from "page_components/404";
import Profile, { UpdateProfileForm } from "page_components/u";
import { getFetcher } from "utils/fetchers";
import Head from "next/head";

const ProfilePage: NextPageWithLayout = ({ user }: any) => {
  const [width, setWidth] = useState(0);
  const [currentUser] = useContext(UserContext);

  function resizeWidth() {
    setWidth(window.innerWidth);
  }

  useLayoutEffect(() => {
    resizeWidth();
    window.addEventListener("resize", resizeWidth);
  }, []);

  if (currentUser?._id != user?._id) return <NotFoundComponent />;

  return (
    <main className="content-width pad-one">
      <Profile width={width} user={user} page="settings" />
      <UpdateProfileForm user={user} />
      <Head>
        <title>{user?.username}: Quizr</title>
      </Head>
    </main>
  );
};

ProfilePage.Layout = Layout;
export default ProfilePage;

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

  return { props: { user } };
};
