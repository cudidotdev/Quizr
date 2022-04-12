import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HelpIcon, Logo, PodiumIcon, UserIcon } from "components/icons";
import styles from "styles/components/headers.module.css";
import { Linkr } from "components/links";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const [width, setWidth] = useState<number>(0);
  const menuContainer = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function updateWidth() {
    setWidth(window.innerWidth);
  }

  function closeMenu() {
    menuContainer.current?.classList.remove(styles.Active);
  }

  useLayoutEffect(() => {
    updateWidth();
  }, []);

  /* eslint-disable */
  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    router.events.on("routeChangeStart", closeMenu);

    return () => {
      window.removeEventListener("resize", updateWidth);
      router.events.off("routeChangeStart", closeMenu);
    };
  }, []);
  /* eslint-enable */

  return (
    <header className={styles.Header}>
      <nav className={`site-width ${styles.Padder}`}>
        <Linkr
          _className={`${styles.IconTextContainer} ${styles.LogoContainer}`}
          href="/"
        >
          <Logo />
          <div className={`t-medium ${styles.IconText} ${styles.LogoText}`}>
            Quizr
          </div>
        </Linkr>
        {width > 600 ? (
          <div>
            <Linkr _className={`${styles.IconTextContainer}`} href="/board">
              <PodiumIcon />
              <div className={`${styles.IconText}`}>LeaderBoards</div>
            </Linkr>
            <Linkr _className={`${styles.IconTextContainer}`} href="/help">
              <HelpIcon />
              <div className={`${styles.IconText}`}>Help</div>
            </Linkr>
            <Linkr _className={`${styles.IconTextContainer}`} href="/in">
              <UserIcon />
              <div className={`${styles.IconText}`}>Login</div>
            </Linkr>
          </div>
        ) : (
          <div className={styles.MenuContainer} ref={menuContainer}>
            <button
              className={styles.MenuBar}
              onClick={() =>
                menuContainer.current?.classList.toggle(styles.Active)
              }
            >
              <span></span>
              <span></span>
            </button>
            <div className={styles.Menu}>
              <Linkr _className={`${styles.IconTextContainer}`} href="/board">
                <PodiumIcon />
                <div className={`${styles.IconText}`}>LeaderBoards</div>
              </Linkr>
              <Linkr _className={`${styles.IconTextContainer}`} href="/help">
                <HelpIcon />
                <div className={`${styles.IconText}`}>Help</div>
              </Linkr>
              <Linkr _className={`${styles.IconTextContainer}`} href="/in">
                <UserIcon />
                <div className={`${styles.IconText}`}>Login</div>
              </Linkr>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
