import React, {
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { UserContext } from "components/app";
import { getFetcher, patchFetcher } from "utils/fetchers";
import styles from "styles/pages/U.module.css";
import Image from "next/image";
import { Linkr } from "components/links";
import { ExitIcon, ReloadIcon } from "components/icons";
import BtnStyles from "styles/components/buttons.module.css";
import ListContainer, { LinkList } from "components/lists";
import { TripleSquareLoader } from "components/loaders";
import Pagination from "components/pagination";
import { modifyTimeForDisplay } from "utils";
import { calculateEXP } from "utils/quiz";
import { Inputr, Passwordr, Submitr } from "components/forms";

export const ProfileContainer: React.FC<any> = ({ user, width }) => {
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
          <div className={styles.Data}>Rank:&ensp;#{!!user && user.rank}</div>
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
        href={`/u/${user?.username}`}
        className={page === "home" ? styles.Active : ""}
      >
        Quizzes
      </Linkr>
      {currentUser?._id == user?._id && (
        <Linkr
          href={`/u/${user?.username}/settings`}
          className={page === "settings" ? styles.Active : ""}
        >
          Settings
        </Linkr>
      )}
    </nav>
  );
};

const Profile: React.FC<{ user: any; width: number; page: string }> = ({
  user,
  page = "home",
}) => {
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
    <>
      <ProfileContainer user={user} width={width} />
      <div className={styles.LogoutBox}>
        {width < 520 && currentUser?._id == user?._id && <LogoutComponent />}
      </div>
      <ProfileNav user={user} page={page} />
    </>
  );
};

export const QuizzesTakenComponent: React.FC<any> = ({ user }) => {
  const [idx, setIdx] = useState(1);
  const [error, setError] = useState<string>();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [user]);
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

export const UpdateProfileForm: React.FC<{ user: any }> = ({ user }) => {
  const [data, setData] = useState<any>({
    username: "",
    email: "",
    password: "",
    currentPassword: "",
    profilePicture: "",
  });
  const [pictures, setPictures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function refreshPictures() {
    setPictures(
      new Array(12)
        .fill(0)
        .map(
          (e) => `https://avatars.dicebear.com/api/bottts/${Math.random()}.svg`
        )
    );
  }

  async function updateUser() {
    setLoading(true);
    const res = await patchFetcher(`/api/user/update`, data);
    setLoading(false);
  }

  useEffect(() => {
    refreshPictures();
  }, []);

  return (
    <div className={styles.ProfileFormContainer}>
      <h2 className="t-regular">UPDATE PROFILE</h2>
      <form>
        <Inputr
          name="username"
          label={`Change Username ${data.username ? "(modified)" : ""}`}
          value={data.username}
          onChange={(value) =>
            setData((prev: any) => {
              return { ...prev, username: value };
            })
          }
        />
        <Inputr
          type="email"
          label={`Change Email ${data.email ? "(modified)" : ""}`}
          name="email"
          value={data.email}
          onChange={(value) =>
            setData((prev: any) => {
              return { ...prev, email: value };
            })
          }
        />
        <Passwordr
          name="password"
          label={`Change Password ${data.password ? "(modified)" : ""}`}
          value={data.password}
          onChange={(value) =>
            setData((prev: any) => {
              return { ...prev, password: value };
            })
          }
        />
        <ProfilePictureChanger
          pictures={pictures}
          $picture={data.profilePicture}
          set$picture={(value) =>
            setData((prev: any) => {
              return { ...prev, profilePicture: value };
            })
          }
          refreshPictures={refreshPictures}
        />
        <div
          style={{
            borderTop: "1px solid var(--color-grey-three)",
            paddingTop: "0.375rem",
          }}
        >
          <Passwordr
            label="Enable Update By Entering Current Password"
            name="currentPassword"
            value={data.currentPassword}
            onChange={(value) =>
              setData((prev: any) => {
                return { ...prev, currentPassword: value };
              })
            }
            required
          />
          <Submitr onClick={updateUser}>Update</Submitr>
        </div>
      </form>
    </div>
  );
};

const ProfilePictureChanger: React.FC<{
  pictures: string[];
  $picture: string | undefined;
  set$picture: (value: string) => any;
  refreshPictures: () => any;
}> = ({ pictures, $picture, refreshPictures, set$picture }) => {
  const parent = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.ProfilePictureChanger} ref={parent}>
      <label>Change Profile Picture {!!$picture && "(modified)"}</label>
      <div
        tabIndex={0}
        onFocus={() => parent.current?.classList.add(styles.Color)}
        onBlur={() => parent.current?.classList.remove(styles.Color)}
      >
        <div className={styles.PictureContainer}>
          {pictures.map((picture, idx) => (
            <div key={idx}>
              <span
                className={`${styles.Picture} ${
                  $picture === picture ? styles.Selected : ""
                }`}
                tabIndex={0}
                onClick={() => set$picture(picture)}
                onKeyDown={(e) => e.key === "Enter" && set$picture(picture)}
              >
                <Image
                  src={picture}
                  alt="profile pictures"
                  width="100%"
                  height="100%"
                />
              </span>
            </div>
          ))}
        </div>
        <div className={styles.NextBtnBox}>
          <button
            className={`${BtnStyles.BtnPrimaryX} ${BtnStyles.BtnIcon}`}
            type="button"
            onClick={refreshPictures}
          >
            Refresh
            <span className={BtnStyles.IconRight}>
              <ReloadIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
