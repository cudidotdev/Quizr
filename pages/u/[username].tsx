import { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import styles from "styles/pages/U.module.css";
import { GetStaticPaths, GetStaticProps } from "next";
import connectDB from "database/connect";
import { User } from "database/models";
import Image from "next/image";
import BtnStyles from "styles/components/buttons.module.css";
import { ExitIcon } from "components/icons";
import { Linkr } from "components/links";
import { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "components/app";

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

  return (
    <main className="content-width pad-one">
      <ProfileContainer user={user} width={width} />
      <div className={styles.LogoutBox}>
        {width < 520 && currentUser._id == user._id && <LogoutComponent />}
      </div>
    </main>
  );
};

const ProfileContainer: React.FC<any> = ({ user, width }) => {
  const [currentUser] = useContext(UserContext);

  return (
    <div className={styles.ProfileContainer}>
      <div className={styles.DPBox}>
        <span className={styles.DP}>
          {!!user && (
            <Image
              src={user.profilePicture}
              alt="profile picture"
              width="100%"
              height="100%"
            />
          )}
        </span>
      </div>
      <div className={`${styles.ProfileInfoBox} t-mono`}>
        <div className={styles.DataBox}>
          <div className={styles.Data}>{!!user && user.username}</div>
        </div>
        <div className={styles.DataBox}>
          <div className={styles.Data}>Rank:&ensp;#1</div>
        </div>
        <div className={styles.DataBox}>
          <div className={styles.Data}>EXP:&ensp;{!!user && user.EXP}</div>
        </div>
        <div className={styles.DataBox}>
          <div className={styles.Data}>
            Quizzes Taken:&ensp;{!!user && user.quizzesTaken}
          </div>
        </div>
        <div className={styles.DataBox}>
          <div className={styles.Data}>
            {width < 360 ? "Avg. Score" : "Average Score"}:&ensp;
            {!!user && user.averageScore}
          </div>
        </div>
      </div>
      {width > 520 && currentUser?._id == user?._id && (
        <div className={styles.LogoutBox}>
          <LogoutComponent />
        </div>
      )}
    </div>
  );
};

export const LogoutComponent: React.FC<any> = ({ user }) => {
  return (
    <div>
      <Linkr
        className={`${BtnStyles.BtnPrimaryX} ${BtnStyles.BtnIcon}`}
        href="/out"
      >
        <span className={BtnStyles.Icon}>
          <ExitIcon />
        </span>
        Logout
      </Linkr>
    </div>
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
