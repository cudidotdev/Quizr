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
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { UserContext } from "components/app";
import { getFetcher } from "utils/fetchers";
import Pagination from "components/pagination";
import { TripleSquareLoader } from "components/loaders";
import { useRouter } from "next/router";
import ListContainer, { LinkList } from "components/lists";
import { modifyTimeForDisplay } from "utils";
import { calculateEXP } from "utils/quiz";

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
        {width < 520 && currentUser?._id == user?._id && <LogoutComponent />}
      </div>
      <ProfileNav user={user} page="home" />
      <QuizzesTakenComponent user={user} />
    </main>
  );
};

export const ProfileContainer: React.FC<any> = ({ user: _user, width }) => {
  const [currentUser] = useContext(UserContext);
  const [rank, setRank] = useState<number>(0);
  const [user, setUser] = useState(_user);

  async function getRank() {
    const res = await getFetcher(`/api/user/rank?id=${user._id}`);
    if (!res) return;
    const { success, data, error } = res;
    if (!success) return;
    setRank(data);
  }

  async function refreshUser() {
    const res = await getFetcher(`/api/user?id=${user._id}`);
    if (!res) return;
    if (!res.success) return;
    setUser(res.data);
  }

  /*eslint-disable*/
  useEffect(() => {
    getRank();
    refreshUser();
  }, [_user]);
  /*eslint-enable*/

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
          <div className={styles.Data}>Rank:&ensp;#{rank ? rank : "-"}</div>
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

export const ProfileNav: React.FC<any> = ({ user, page }) => {
  const [currentUser] = useContext(UserContext);
  return (
    <nav className={styles.ProfileNav}>
      <Linkr
        href={`/u/${user.username}`}
        className={page === "home" ? styles.Active : ""}
      >
        Quizzes
      </Linkr>
      {currentUser?._id == user?._id && (
        <Linkr
          href={`/u/${user.username}/settings`}
          className={page === "settings" ? styles.Active : ""}
        >
          Settings
        </Linkr>
      )}
    </nav>
  );
};

const QuizzesTakenComponent: React.FC<any> = ({ user }) => {
  const [idx, setIdx] = useState(1);
  const [error, setError] = useState<string>();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const maxPerPage = 4;
  const pages = Math.ceil(scores.length / maxPerPage);
  const $scores = useMemo(() => {
    const $: any[][] = new Array(pages).fill(0).map((n) => []);

    scores.forEach((score, idx) => {
      const n = Math.floor(idx / maxPerPage);
      const nn = idx % maxPerPage;
      $[n][nn] = score;
    });

    return $;
  }, [scores, pages]);

  async function getScores() {
    const res = await getFetcher(`/api/quiz/scores?uId=${user._id}`);
    if (!res) return setError("It seems there is no internet connection");

    const { success, data, error } = res;
    if (!success) return setError(error.message);

    setLoading(false);
    setScores(
      data.sort((a: any, b: any) =>
        a.quiz.title.toLowerCase() < b.quiz.title.toLowerCase() ? -1 : 1
      )
    );
  }

  /*eslint-disable */
  useEffect(() => {
    getScores();
  }, []);
  /*eslint-enable */

  return (
    <div className={styles.QuizTakenContainer}>
      <Pagination from={1} to={pages} idx={idx} setIdx={setIdx} />
      {loading ? (
        <p className={styles.LoaderBox}>
          Fetching quizzes <TripleSquareLoader colored />
        </p>
      ) : $scores.length ? (
        <ListContainer start={(idx - 1) * maxPerPage + 1}>
          {$scores[idx - 1].map((score: any, idx: any) => (
            <LinkList href={`/q/${score.quiz.urlName}`} key={idx}>
              <div className={`${styles.ProfileInfoBox} t-mono`}>
                <div className={styles.DataBox}>
                  <div className={styles.Data}>{score.quiz.title}</div>
                </div>
                <div className={styles.DataBox}>
                  <div className={styles.Data}>Score:&ensp;{score.score}</div>
                </div>
                <div className={styles.DataBox}>
                  <div className={styles.Data}>
                    Time:&ensp;{modifyTimeForDisplay(score.quizTime)}
                  </div>
                </div>
                <div className={styles.DataBox}>
                  <div className={`${styles.Data} ${styles.Green}`}>
                    +{calculateEXP(score.score, score.quizTime)} EXP
                  </div>
                </div>
              </div>
            </LinkList>
          ))}
        </ListContainer>
      ) : (
        <p className={styles.LoaderBox}>No quizzes</p>
      )}
      <Pagination from={1} to={pages} idx={idx} setIdx={setIdx} />
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
