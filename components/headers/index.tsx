import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  HelpIcon,
  LoginIcon,
  Logo,
  LogoutIcon,
  PodiumIcon,
  ProfileIcon,
  UserIcon,
} from "components/icons";
import styles from "styles/components/headers.module.css";
import { Linkr } from "components/links";
import { useRouter } from "next/router";
import { UserContext } from "components/app";
import Image from "next/image";

const Header: React.FC = () => {
  const [width, setWidth] = useState<number>(0);
  const [user] = useContext(UserContext);

  function updateWidth() {
    setWidth(window.innerWidth);
  }

  useLayoutEffect(() => {
    updateWidth();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <header className={styles.Header}>
      <nav className={`site-width ${styles.Padder}`}>
        <Linkr
          className={`${styles.IconTextContainer} ${styles.LogoContainer}`}
          href="/"
        >
          <Logo />
          <div className={`t-medium ${styles.IconText} ${styles.LogoText}`}>
            Quizr
          </div>
        </Linkr>
        {width > 600 ? (
          <div>
            <Linkr className={`${styles.IconTextContainer}`} href="/board">
              <PodiumIcon />
              <div className={`${styles.IconText}`}>LeaderBoards</div>
            </Linkr>
            <Linkr className={`${styles.IconTextContainer}`} href="/help">
              <HelpIcon />
              <div className={`${styles.IconText}`}>Help</div>
            </Linkr>
            {!user ? (
              <Linkr className={`${styles.IconTextContainer}`} href="/in">
                <UserIcon />
                <div className={`${styles.IconText}`}>Login</div>
              </Linkr>
            ) : (
              <div className={`${styles.MenuContainer}`}>
                <div className={`${styles.ProfilePictureBox}`}>
                  <Image
                    src={user.profilePicture}
                    alt="profile picture"
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
                <div className={styles.Menu}>
                  <Linkr className={`${styles.IconTextContainer}`} href="/u/01">
                    <ProfileIcon />
                    <div className={`${styles.IconText}`}>Profile</div>
                  </Linkr>
                  <Linkr className={`${styles.IconTextContainer}`} href="/out">
                    <LogoutIcon />
                    <div className={`${styles.IconText}`}>Logout</div>
                  </Linkr>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {!!user && (
              <Linkr href="/u/01" className={`${styles.ProfilePictureBox}`}>
                <Image
                  src={user.profilePicture}
                  alt="profile picture"
                  width={"100%"}
                  height={"100%"}
                />
              </Linkr>
            )}
            <div className={styles.MenuContainer}>
              <button className={styles.MenuBar}>
                <span></span>
                <span></span>
              </button>
              <div className={styles.Menu}>
                {!!user && (
                  <Linkr className={`${styles.IconTextContainer}`} href="/u/01">
                    <ProfileIcon />
                    <div className={`${styles.IconText}`}>Profile</div>
                  </Linkr>
                )}
                <Linkr className={`${styles.IconTextContainer}`} href="/board">
                  <PodiumIcon />
                  <div className={`${styles.IconText}`}>LeaderBoards</div>
                </Linkr>
                <Linkr className={`${styles.IconTextContainer}`} href="/help">
                  <HelpIcon />
                  <div className={`${styles.IconText}`}>Help</div>
                </Linkr>
                {!user ? (
                  <Linkr className={`${styles.IconTextContainer}`} href="/in">
                    <UserIcon />
                    <div className={`${styles.IconText}`}>Login</div>
                  </Linkr>
                ) : (
                  <Linkr className={`${styles.IconTextContainer}`} href="/out">
                    <LogoutIcon />
                    <div className={`${styles.IconText}`}>Logout</div>
                  </Linkr>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
