import React from "react";
import { Logo } from "components/icon";
import styles from "styles/components/headers.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.Header}>
      <div className={styles.LogoContainer}>
        <Logo />
      </div>
    </header>
  );
};

export default Header;
