import { Inputr, Passwordr, Sumbitr } from "components/forms";
import { Linkr } from "components/links";
import React from "react";
import styles from "styles/pages/In.module.css";

const LoginForm: React.FC = () => {
  return (
    <div className={`box-width ${styles.LoginForm}`}>
      <h1 className={`${styles.Heading} t-regular`}>Log in</h1>
      <form name="loginForm" id="loginForm">
        <div className={styles.InputBox}>
          <Inputr label="Username or Email" name="user" required />
        </div>
        <div className={styles.InputBox}>
          <Passwordr name="password" required />
        </div>
        <div className={styles.InputBox}>
          <Sumbitr form="loginForm">Log in</Sumbitr>
        </div>
      </form>
      <div className={styles.footer}>
        <p>Don&apos;t have an account?</p>
        <Linkr _className={styles.link}>Create Account</Linkr>
      </div>
    </div>
  );
};

export default LoginForm;
