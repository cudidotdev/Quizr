import {
  DraftIcon,
  PeopleIcon,
  PieChartIcon,
  QuizIcon,
} from "components/icons";
import { Linkr } from "components/links";
import React, { useEffect, useRef } from "react";
import styles from "styles/pages/Admin.module.css";

const Nav: React.FC = () => {
  const adminNav = useRef<HTMLElement>(null);

  useEffect(() => {
    adminNav.current?.scrollTo({ left: 98, behavior: "smooth" });
  });

  return (
    <nav className={styles.AdminNav} ref={adminNav}>
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
