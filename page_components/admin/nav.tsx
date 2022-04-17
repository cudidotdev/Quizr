import {
  DraftIcon,
  PeopleIcon,
  PieChartIcon,
  QuizIcon,
} from "components/icons";
import { Linkr } from "components/links";
import React, { useEffect, useRef } from "react";
import styles from "styles/pages/Admin.module.css";

type pagetype = { page?: "quizzes" | "drafts" | "users" | "stats" };

const Nav: React.FC<pagetype> = ({ page }) => {
  useEffect(() => {
    if (page)
      document
        .getElementById(page)
        ?.scrollIntoView({ inline: "center", behavior: "smooth", block:"nearest" });
  }, [page]);

  return (
    <nav className={styles.AdminNav}>
      <Linkr className={styles.IconTextBox} href="/admin/quizzes" id="quizzes">
        <div className={styles.IconBox}>
          <QuizIcon />
        </div>
        Quizzes
      </Linkr>
      <Linkr className={styles.IconTextBox} href="/admin/drafts" id="drafts">
        <div className={styles.IconBox}>
          <DraftIcon />
        </div>
        Drafts
      </Linkr>
      <Linkr className={styles.IconTextBox} href="/admin/users" id="users">
        <div className={styles.IconBox}>
          <PeopleIcon />
        </div>
        Users
      </Linkr>
      <Linkr className={styles.IconTextBox} href="/admin/stats" id="stats">
        <div className={styles.IconBox}>
          <PieChartIcon />
        </div>
        Stats
      </Linkr>
    </nav>
  );
};

export default Nav;
