import React, { useEffect, useMemo, useState } from "react";
import styles from "styles/components/headers.module.css";
import { Linkr } from "components/links";
import { Logo } from "components/icons";
import { modifyTimeForDisplay } from "utils";

const Header: React.FC<{ urlName: string; submitFn: () => any }> = ({
  urlName,
  submitFn,
}) => {
  const firstTime = (10 * 60 + 5) * 1000;
  const [time, setTime] = useState(firstTime);

  function updateTime() {
    const timeStarted =
      JSON.parse(sessionStorage.getItem(`quiz ${urlName}`)!)?.timeStarted || 0;

    if (time && timeStarted)
      setTimeout(
        () => setTime(Math.max(0, firstTime - (Date.now() - timeStarted))),
        1000
      );
  }

  /*eslint-disable*/
  useEffect(() => {
    updateTime();
    if (time == 0) submitFn();
  }, [time]);
  /*eslint-enable*/

  return (
    <header className={`${styles.AdminHeader} ${styles.QuizTakeHeader}`}>
      <div className={`${styles.Padder} site-width`}>
        <Linkr className={styles.LogoContainer} href="/">
          <span className={styles.LogoIconBox}>
            <Logo />
          </span>
          <span className={`${styles.LogoText} t-medium`}>Quizr</span>
        </Linkr>
        <div className={`${styles.Timer} t-mono`}>
          {modifyTimeForDisplay(time)}
        </div>
      </div>
    </header>
  );
};

export default Header;
