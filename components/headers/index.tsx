import React, { useLayoutEffect, useState } from "react";
import { HelpIcon, Logo, PodiumIcon, UserIcon } from "components/icon";
import styles from "styles/components/headers.module.css";
import { Linkr } from "components/links";

const Header: React.FC = () => {
  const [width, setWidth] = useState<number>(0);

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
        {width > 600 && (
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
        )}
      </nav>
    </header>
  );
};

export default Header;
