import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import ListContainer, { LinkList, List } from "components/lists";
import Pagination from "components/pagination";
import { useState, useMemo, useEffect } from "react";
import { getFetcher } from "utils/fetchers";
import styles from "styles/pages/Board.module.css";
import Image from "next/image";
import Head from "next/head";
import { GetServerSideProps } from "next";
import connectDB from "database/connect";
import { User } from "database/models";

const LeaderBoardsPage: NextPageWithLayout = ({ leaderboards }: any) => {
  return (
    <main className="content-width pad-one">
      <LeaderBoards leaderboards={leaderboards} />
      <Head>
        <title>LeaderBoards: Quizr</title>
      </Head>
    </main>
  );
};

LeaderBoardsPage.Layout = Layout;

export default LeaderBoardsPage;

const LeaderBoards: React.FC<{ leaderboards: any[] }> = ({ leaderboards }) => {
  const [idx, setIdx] = useState(1);

  const maxPerPage = 10;
  const pages = Math.ceil(leaderboards.length / maxPerPage);
  const $leaderboards = useMemo(() => {
    const $: any[][] = new Array(pages).fill(0).map((n) => []);

    leaderboards.forEach((user, idx) => {
      const n = Math.floor(idx / maxPerPage);
      const nn = idx % maxPerPage;
      $[n][nn] = user;
    });

    return $;
  }, [leaderboards, pages]);

  return (
    <div className={styles.LeaderBoard}>
      <h1 className={`${styles.Title} t-regular`}>LEADERBOARDS</h1>
      <Pagination from={1} to={pages} idx={idx} setIdx={setIdx} />
      {$leaderboards.length ? (
        <ScoreContainer
          leaderboards={$leaderboards[idx - 1]}
          start={(idx - 1) * maxPerPage + 1}
        />
      ) : (
        <></>
      )}
      <Pagination from={1} to={pages} idx={idx} setIdx={setIdx} />
    </div>
  );
};

const ScoreContainer: React.FC<{ leaderboards: any; start: number }> = ({
  leaderboards,
  start,
}) => {
  return (
    <ListContainer>
      {leaderboards.map((user: any, idx: any) => (
        <LinkList href={`/u/${user.username}`} key={idx} noIndex>
          <div className={`${styles.ProfileBox} t-mono`}>
            <div className={styles.DP}>
              <Image
                src={user.profilePicture}
                alt={`${user.username} profilePicture`}
                width="100%"
                height="100%"
              />
            </div>
            <div className={`${styles.ProfileInfoBox} t-mono`}>
              <div className={styles.DataBox}>
                <div className={styles.Data}>{!!user && user.username}</div>
              </div>
              <div className={styles.DataBox}>
                <div className={`${styles.Data} ${styles.Green}`}>
                  Rank:&ensp;#{!!user && user.rank}
                </div>
              </div>
              <div className={styles.DataBox}>
                <div className={styles.Data}>
                  EXP:&ensp;{!!user && user.EXP}
                </div>
              </div>
              <div className={styles.DataBox}>
                <div className={styles.Data}>
                  Quizzes Taken:&ensp;{!!user && user.quizzesTaken}
                </div>
              </div>
              <div className={styles.DataBox}>
                <div className={styles.Data}>
                  Average Score:&ensp;
                  {!!user && user.averageScore}
                </div>
              </div>
            </div>
          </div>
        </LinkList>
      ))}
    </ListContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  await connectDB();

  const leaderboards = await User.find()
    .select("username profilePicture quizzesTaken averageScore EXP")
    .sort("-EXP")
    .lean();

  leaderboards.forEach((e, idx) => {
    e.rank = idx + 1;
    e._id = e._id.toString();
  });

  return { props: { leaderboards } };
};
