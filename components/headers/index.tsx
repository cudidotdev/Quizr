import React from "react";
import { Logo } from "components/icon";
import styles from "styles/components/headers.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.Header}>
      <div className={`site-width ${styles.Padder}`}>
        <div className={styles.LogoContainer}>
          <Logo />
          <div className={styles.LogoText}>Quizr</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
