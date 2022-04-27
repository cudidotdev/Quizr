import React from "react";
import styles from "styles/components/headers.module.css";
import { Linkr } from "components/links";
import { Logo } from "components/icons";

const Header: React.FC = () => {
  return (
    <header className={`${styles.AdminHeader} ${styles.QuizTakeHeader}`}>
      <div className={`${styles.Padder} site-width`}>
        <Linkr className={styles.LogoContainer} href="/">
          <span className={styles.LogoIconBox}>
            <Logo />
          </span>
          <span className={`${styles.LogoText} t-medium`}>Quizr</span>
        </Linkr>
      </div>
    </header>
  );
};

export default Header;
