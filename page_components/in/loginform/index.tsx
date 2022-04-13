import { Inputr, Passwordr, Submitr } from "components/forms";
import { Linkr } from "components/links";
import { TripleSquareLoader } from "components/loaders";
import { useRouter } from "next/router";
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
  const [error, setError] = useState<string | null>(null);
  const loginForm = useRef<HTMLFormElement>(null);
  const router = useRouter();

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

  function processError(error: any) {
    const { name, message } = error;

    if (name === "not resolved")
      return setError("It seems there is a connection error");
    if (name === "user" || name === "password") {
      //@ts-ignore
      document.loginForm[name].focus();
      return setError(message);
    }
    return setError("Unkwown server error, please try again");
  }

  async function submitHandler(ev: any) {
    ev.preventDefault();

    setLoading(true);
    const res = await postFetcher("/api/user/login", loginDetails);
    setLoading(false);

    if (!res) return processError({ name: "not resolved" });
    const { success, data, error } = res;
    if (!success) return processError(error);

    router.push("/");
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
        {!!error && (
          <div className={`${styles.InputBox} ${styles.ErrorMsg}`}>
            <span className={`${styles.Icon} t-medium`}>!</span>
            <p className={styles.Msg}>
              {error}.
              {error === "Oops, username or email doesn't exists" && (
                <>
                  {" "}
                  Do you want to{" "}
                  <Linkr className={styles.Link}>create an account ?</Linkr>
                </>
              )}
            </p>
          </div>
        )}
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
