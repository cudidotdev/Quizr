import React, { useLayoutEffect, useRef, useState } from "react";
import { HelpIcon, Logo, PodiumIcon, UserIcon } from "components/icon";
import styles from "styles/components/headers.module.css";
import { Linkr } from "components/links";

const Header: React.FC = () => {
  const [width, setWidth] = useState<number>(0);
  const menuContainer = useRef<HTMLDivElement>(null);

  function updateWidth() {
    setWidth(window.innerWidth);
  }

  useLayoutEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
  }, []);

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
            <Linkr _className={`${styles.IconTextContainer}`}>
              <PodiumIcon />
              <div className={`${styles.IconText}`}>LeaderBoards</div>
            </Linkr>
            <Linkr _className={`${styles.IconTextContainer}`}>
              <HelpIcon />
              <div className={`${styles.IconText}`}>Help</div>
            </Linkr>
            <Linkr _className={`${styles.IconTextContainer}`}>
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
              <Linkr _className={`${styles.IconTextContainer}`}>
                <PodiumIcon />
                <div className={`${styles.IconText}`}>LeaderBoards</div>
              </Linkr>
              <Linkr _className={`${styles.IconTextContainer}`}>
                <HelpIcon />
                <div className={`${styles.IconText}`}>Help</div>
              </Linkr>
              <Linkr _className={`${styles.IconTextContainer}`}>
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
