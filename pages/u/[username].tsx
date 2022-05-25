import { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import styles from "styles/pages/U.module.css";
import { GetStaticPaths, GetStaticProps } from "next";
import connectDB from "database/connect";
import { User } from "database/models";
import Image from "next/image";

const ProfilePage: NextPageWithLayout = ({ user }: any) => {
  return (
    <main className="content-width pad-one">
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
          <div className={styles.UsernameBox}>
            <div className={styles.Username}>{!!user && user.username}</div>
          </div>
          <div className={styles.EXPBox}>
            <div className={styles.EXP}>EXP:&ensp;{!!user && user.EXP}</div>
          </div>
        </div>
        <div className={styles.LogoutBox}></div>
      </div>
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
