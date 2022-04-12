import { Inputr, Passwordr, Sumbitr } from "components/forms";
import { Linkr } from "components/links";
import React, { useState } from "react";
import styles from "styles/pages/In.module.css";
import { postFetcher } from "utils/fetchers";

type loginDetails = {
  user: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const [loginDetails, setLoginDetails] = useState<loginDetails>({
    user: "",
    password: "",
  });

  function setUser(user: string) {
    setLoginDetails((prev) => {
      return { ...prev, user };
    });
  }

  function setPassword(password: string) {
    setLoginDetails((prev) => {
      return { ...prev, password };
    });
  }

  async function submitHandler(ev: any) {
    ev.preventDefault();
    const { success, data, error } = await postFetcher(
      "/api/user/login",
      loginDetails
    );
    if (!success) return console.log(error);
    return console.log(data);
  }

  return (
    <div className={`box-width ${styles.LoginForm}`}>
      <h1 className={`${styles.Heading} t-regular`}>LOGIN</h1>
      <form name="loginForm" id="loginForm" onSubmit={submitHandler}>
        <div className={styles.InputBox}>
          <Inputr
            label="Username or Email"
            name="user"
            value={loginDetails.user}
            onChange={setUser}
            required
          />
        </div>
        <div className={styles.InputBox}>
          <Passwordr
            name="password"
            required
            value={loginDetails.password}
            onChange={setPassword}
          />
        </div>
        <div className={styles.InputBox}>
          <Sumbitr form="loginForm">Log in</Sumbitr>
        </div>
      </form>
      <div className={styles.footer}>
        <p>Don&apos;t have an account?</p>
        <Linkr _className={styles.link}>Create account</Linkr>
      </div>
    </div>
  );
};

export default LoginForm;
