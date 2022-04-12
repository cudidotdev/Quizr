import { Inputr, Passwordr, Submitr } from "components/forms";
import { Linkr } from "components/links";
import { TripleSquareLoader } from "components/loaders";
import React, { useRef, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const loginForm = useRef<HTMLFormElement>(null);

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

  function processError(error: any) {}

  async function submitHandler(ev: any) {
    ev.preventDefault();

    setLoading(true);
    const res = await postFetcher("/api/user/login", loginDetails);
    setLoading(false);

    if (!res) return;
    const { success, data, error } = res;
    if (!success) processError(error);
    return console.log(data);
  }

  useEffect(() => {
    loading
      ? loginForm.current?.classList.add(styles.OnProgress)
      : loginForm.current?.classList.remove(styles.OnProgress);
  }, [loading]);

  return (
    <div className={`box-width ${styles.LoginForm}`}>
      <h1 className={`${styles.Heading} t-regular`}>LOGIN</h1>
      <form
        name="loginForm"
        id="loginForm"
        onSubmit={submitHandler}
        ref={loginForm}
      >
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
          {!loading ? (
            <Submitr form="loginForm">Log in</Submitr>
          ) : (
            <Submitr disabled>
              Logging in <TripleSquareLoader />
            </Submitr>
          )}
        </div>
      </form>
      <div className={styles.footer}>
        <p>Don&apos;t have an account?</p>
        <Linkr className={styles.link}>Create account</Linkr>
      </div>
    </div>
  );
};

export default LoginForm;
