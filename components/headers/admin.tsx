import React from "react";
import type { page } from "types/pages/admin";
import styles from "styles/components/headers.module.css";
import { Linkr } from "components/links";
import { Logo } from "components/icons";

const AdminHeader: React.FC = () => {
  return (
    <header className={styles.AdminHeader}>
      <div className="site-width">
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

export default AdminHeader;
