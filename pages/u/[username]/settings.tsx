import { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import styles from "styles/pages/U.module.css";
import { GetStaticPaths, GetStaticProps } from "next";
import connectDB from "database/connect";
import { User } from "database/models";
import Image from "next/image";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { UserContext } from "components/app";
import NotFoundComponent from "page_components/404";
import { LogoutComponent, ProfileContainer, ProfileNav } from ".";

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
      <ProfileContainer user={user} width={width} />
      <div className={styles.LogoutBox}>
        {width < 520 && currentUser?._id == user?._id && <LogoutComponent />}
      </div>
      <ProfileNav user={user} page="settings" />
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  await connectDB();

  const users = await User.find({}).lean();
  const paths = users.map((user) => {
    return { params: { username: user.username } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await connectDB();
  let user;

  if (params!.username)
    user = await User.findOne({ username: params?.username })
      .select("-createdAt")
      .lean();

  if (!user) return { notFound: true };

  user._id = user._id.toString();

  return {
    props: { user },
    revalidate: 1,
  };
};

ProfilePage.Layout = Layout;
export default ProfilePage;
