import React, { useEffect } from "react";
import { Linkr } from "components/links";
import styles from "styles/pages/Admin.module.css";
import type { page } from "types/pages/admin";
import {
  DraftIcon,
  MenuIcon,
  PeopleIcon,
  PieChartIcon,
  QuizIcon,
} from "components/icons";

const AdminNav: React.FC<{ page?: page }> = ({ page = "overview" }) => {
  function colorActive(page: page) {
    document
      .querySelectorAll("#overview, #quizzes, #drafts, #users, #stats")
      .forEach((elem) => elem.classList.remove(styles.Active));
    document.getElementById(page)?.classList.add(styles.Active);
  }

  useEffect(() => {
    document.getElementById(page)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    colorActive(page);
  }, [page]);

  return (
    <nav className={`${styles.AdminNav}`}>
      <div className={`${styles.Padder} site-width`}>
        <Linkr className={styles.IconTextBox} href="/admin" id="overview">
          <span className={styles.IconBox}>
            <MenuIcon />
          </span>
          Overview
        </Linkr>
        <Linkr
          className={styles.IconTextBox}
          href="/admin/quizzes"
          id="quizzes"
        >
          <span className={styles.IconBox}>
            <QuizIcon />
          </span>
          Quizzes
        </Linkr>
        <Linkr className={styles.IconTextBox} href="/admin/drafts" id="drafts">
          <span className={styles.IconBox}>
            <DraftIcon />
          </span>
          Drafts
        </Linkr>
        <Linkr className={styles.IconTextBox} href="/admin/users" id="users">
          <span className={styles.IconBox}>
            <PeopleIcon />
          </span>
          Users
        </Linkr>
        <Linkr className={styles.IconTextBox} href="/admin/stats" id="stats">
          <span className={styles.IconBox}>
            <PieChartIcon />
          </span>
          Stats
        </Linkr>
      </div>
    </nav>
  );
};

export default AdminNav;
