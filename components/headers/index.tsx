import React from "react";
import { HelpIcon, Logo, PodiumIcon, UserIcon } from "components/icon";
import styles from "styles/components/headers.module.css";
import { Linkr } from "components/links";

const Header: React.FC = () => {
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
        <div className={styles.NavOne}>
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
      </nav>
    </header>
  );
};

export default Header;
