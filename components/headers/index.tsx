import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  HelpIcon,
  KeyIcon,
  Logo,
  LogoutIcon,
  PodiumIcon,
  ProfileIcon,
  UserIcon,
} from "components/icons";
import styles from "styles/components/headers.module.css";
import { Linkr } from "components/links";
import { UserContext } from "components/app";
import Image from "next/image";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const [width, setWidth] = useState<number>(0);
  const [user] = useContext(UserContext);
  const menuContainer1 = useRef<HTMLDivElement>(null);
  const menuContainer2 = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function updateWidth() {
    setWidth(window.innerWidth);
  }

  function removeActive(refObj: React.RefObject<HTMLElement>) {
    refObj.current?.classList.remove(styles.Active);
  }

  useLayoutEffect(() => {
    updateWidth();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    router.events.on("routeChangeStart", () => {
      removeActive(menuContainer1);
      removeActive(menuContainer2);
    });

    return () => {
      window.removeEventListener("resize", updateWidth);
      router.events.off("routeChangeStart", () => {
        removeActive(menuContainer1);
        removeActive(menuContainer2);
      });
    };
  }, [router]);

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
            {user?.isAdmin === true && (
              <Linkr className={`${styles.IconTextContainer}`} href={`/admin`}>
                <KeyIcon />
                <div className={`${styles.IconText}`}>Admin</div>
              </Linkr>
            )}
            <Linkr className={`${styles.IconTextContainer}`} href="/about">
              <HelpIcon />
              <div className={`${styles.IconText}`}>About</div>
            </Linkr>
            {!user?.isAdmin && (
              <Linkr className={`${styles.IconTextContainer}`} href="/board">
                <PodiumIcon />
                <div className={`${styles.IconText}`}>LeaderBoards</div>
              </Linkr>
            )}
            {!user ? (
              <Linkr className={`${styles.IconTextContainer}`} href="/in">
                <UserIcon />
                <div className={`${styles.IconText}`}>Login</div>
              </Linkr>
            ) : (
              <div
                className={`${styles.MenuContainer}`}
                ref={menuContainer1}
                onMouseOver={(ev) =>
                  ev.currentTarget.classList.add(styles.Active)
                }
                onMouseOut={(ev) =>
                  ev.currentTarget.classList.remove(styles.Active)
                }
              >
                <div className={`${styles.ProfilePictureBox}`}>
                  <Image
                    src={user.profilePicture}
                    className={styles.ProfilePicture}
                    alt="profile picture"
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
                <div className={styles.Menu}>
                  <Linkr
                    className={`${styles.IconTextContainer}`}
                    href={`/u/${user.username}`}
                  >
                    <ProfileIcon />
                    <div className={`${styles.IconText}`}>Profile</div>
                  </Linkr>
                  {user?.isAdmin === true && (
                    <Linkr
                      className={`${styles.IconTextContainer}`}
                      href="/board"
                    >
                      <PodiumIcon />
                      <div className={`${styles.IconText}`}>LeaderBoards</div>
                    </Linkr>
                  )}
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
              <Linkr
                href={`/u/${user.username}`}
                className={`${styles.ProfilePictureBox}`}
              >
                <Image
                  src={user.profilePicture}
                  className={styles.ProfilePicture}
                  alt="profile picture"
                  width={"100%"}
                  height={"100%"}
                />
              </Linkr>
            )}
            <div
              className={styles.MenuContainer}
              ref={menuContainer2}
              onMouseOver={(ev) =>
                ev.currentTarget.classList.add(styles.Active)
              }
              onMouseOut={(ev) =>
                ev.currentTarget.classList.remove(styles.Active)
              }
            >
              <button className={styles.MenuBar}>
                <span></span>
                <span></span>
              </button>
              <div className={styles.Menu}>
                {!!user && (
                  <Linkr
                    className={`${styles.IconTextContainer}`}
                    href={`/u/${user.username}`}
                  >
                    <ProfileIcon />
                    <div className={`${styles.IconText}`}>Profile</div>
                  </Linkr>
                )}
                {user?.isAdmin === true && (
                  <Linkr
                    className={`${styles.IconTextContainer}`}
                    href={`/admin`}
                  >
                    <KeyIcon />
                    <div className={`${styles.IconText}`}>Admin</div>
                  </Linkr>
                )}
                <Linkr className={`${styles.IconTextContainer}`} href="/board">
                  <PodiumIcon />
                  <div className={`${styles.IconText}`}>LeaderBoards</div>
                </Linkr>
                <Linkr className={`${styles.IconTextContainer}`} href="/about">
                  <HelpIcon />
                  <div className={`${styles.IconText}`}>About</div>
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
export { default as AdminHeader } from "./admin";
