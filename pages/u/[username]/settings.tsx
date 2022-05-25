import { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { GetStaticPaths, GetStaticProps } from "next";
import connectDB from "database/connect";
import { User } from "database/models";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { UserContext } from "components/app";
import NotFoundComponent from "page_components/404";
import Profile, { UpdateProfileForm } from "page_components/u";
import { getFetcher } from "utils/fetchers";

const ProfilePage: NextPageWithLayout = ({ user: _user }: any) => {
  const [width, setWidth] = useState(0);
  const [currentUser] = useContext(UserContext);

  const [user, setUser] = useState(_user);

  function resizeWidth() {
    setWidth(window.innerWidth);
  }

  async function getRank() {
    const res = await getFetcher(`/api/user/rank?id=${_user._id}`);
    if (!res) return;
    const { success, data, error } = res;
    if (!success) return;
    return data;
  }

  async function refreshUser() {
    const rank = await getRank();
    const res = await getFetcher(`/api/user?id=${_user._id}`);
    if (!res) return;
    if (!res.success) return;
    setUser({ ...res.data, rank });
  }

  /*eslint-disable*/
  useEffect(() => {
    refreshUser();
  }, [_user]);
  /*eslint-enable*/

  useLayoutEffect(() => {
    resizeWidth();
    window.addEventListener("resize", resizeWidth);
  }, []);

  if (currentUser?._id != user?._id) return <NotFoundComponent />;

  return (
    <main className="content-width pad-one">
      <Profile width={width} user={user} page="settings" />
      <UpdateProfileForm user={user} />
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
  const rank =
    (await User.find({ EXP: { $gt: user.EXP } }).select("EXP")).length + 1;
  user.rank = rank;

  return {
    props: { user },
    revalidate: 1,
  };
};

ProfilePage.Layout = Layout;
export default ProfilePage;
