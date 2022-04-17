import {
  DraftIcon,
  PeopleIcon,
  PieChartIcon,
  QuizIcon,
} from "components/icons";
import { Linkr } from "components/links";
import React from "react";
import styles from "styles/pages/Admin.module.css";

const Nav: React.FC = () => {
  return (
    <nav className={styles.AdminNav}>
      <Linkr className={styles.IconTextBox}>
        <div className={styles.IconBox}>
          <QuizIcon />
        </div>
        Quizzes
      </Linkr>
      <Linkr className={styles.IconTextBox}>
        <div className={styles.IconBox}>
          <DraftIcon />
        </div>
        Drafts
      </Linkr>
      <Linkr className={styles.IconTextBox}>
        <div className={styles.IconBox}>
          <PeopleIcon />
        </div>
        Users
      </Linkr>
      <Linkr className={styles.IconTextBox}>
        <div className={styles.IconBox}>
          <PieChartIcon />
        </div>
        Stats
      </Linkr>
    </nav>
  );
};

export default Nav;
