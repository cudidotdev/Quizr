import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import ListContainer, { LinkList, List } from "components/lists";
import Pagination from "components/pagination";
import { useState, useMemo, useEffect } from "react";
import { getFetcher } from "utils/fetchers";
import Qstyles from "styles/pages/Q.module.css";
import Ustyles from "styles/pages/U.module.css";
import Image from "next/image";

const LeaderBoardsPage: NextPageWithLayout = () => {
  return (
    <main className="content-width pad-one">
      <LeaderBoards />
    </main>
  );
};

LeaderBoardsPage.Layout = Layout;

export default LeaderBoardsPage;

const LeaderBoards: React.FC = () => {
  const [idx, setIdx] = useState(1);
  const [error, setError] = useState<string>();
  const [leaderboards, setLeaderBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  async function getScores() {
    const res = await getFetcher(`/api/quiz/leaderboards`);
    if (!res) return setError("It seems there is no internet connection");

    const { success, data, error } = res;
    if (!success) return setError(error.message);

    setLoading(false);
    setLeaderBoards(data);
  }

  useEffect(() => {
    getScores();
  }, []);

  return (
    <div className={Qstyles.LeaderBoard}>
      <h2 className={`${Qstyles.Title} t-regular`}>LEADERBOARD</h2>
      <Pagination from={1} to={pages} idx={idx} setIdx={setIdx} />
      {loading ? (
        <LeaderBoardsFallBack />
      ) : $leaderboards.length ? (
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
    <ListContainer start={start}>
      {leaderboards.map((user: any, idx: any) => (
        <LinkList href={`/u/${user.username}`} key={idx}>
          <div className={`${Qstyles.ScoreBox} t-mono`}>
            <div className={Qstyles.DP}>
              <Image
                src={user.profilePicture}
                alt={`${user.username} profilePicture`}
                width="100%"
                height="100%"
              />
            </div>
            <div className={`${Ustyles.ProfileInfoBox} t-mono`}>
              <div className={Ustyles.DataBox}>
                <div className={Ustyles.Data}>{!!user && user.username}</div>
              </div>
              <div className={Ustyles.DataBox}>
                <div className={Ustyles.Data}>
                  Rank:&ensp;#{!!user && user.rank}
                </div>
              </div>
              <div className={Ustyles.DataBox}>
                <div className={Ustyles.Data}>
                  EXP:&ensp;{!!user && user.EXP}
                </div>
              </div>
              <div className={Ustyles.DataBox}>
                <div className={Ustyles.Data}>
                  Quizzes Taken:&ensp;{!!user && user.quizzesTaken}
                </div>
              </div>
              <div className={Ustyles.DataBox}>
                <div className={Ustyles.Data}>
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

const LeaderBoardsFallBack: React.FC = () => (
  <ListContainer className={Qstyles.FallBack}>
    {new Array(10).fill(0).map((e, idx) => (
      <List key={idx}>
        <div className={`${Qstyles.Container} t-mono`}>
          <div className={`${Qstyles.DP} ${Qstyles.Blink}`}></div>
          <div>
            <div className={`${Qstyles.Username} ${Qstyles.Blink}`}></div>
            <div className={`${Qstyles.ST} ${Qstyles.Blink}`}>Score</div>
            <div className={`${Qstyles.ST} ${Qstyles.Blink}`}>Time</div>
            <div className={`${Qstyles.EXPBox} ${Qstyles.Blink}`}></div>
          </div>
        </div>
      </List>
    ))}
  </ListContainer>
);
