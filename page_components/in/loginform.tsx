import { Inputr, Passwordr, Submitr } from "components/forms";
import { Linkr } from "components/links";
import { TripleSquareLoader } from "components/loaders";
import { useRouter } from "next/router";
import React, { useRef, useEffect, useState, useContext } from "react";
import styles from "styles/pages/In.module.css";
import { postFetcher } from "utils/fetchers";
import { UserContext } from "components/app";

type loginDetails = {
  user: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const [loginDetails, setLoginDetails] = useState<loginDetails>({
    user: "",
    password: "",
  });
  const [loading, setLoading] = useState({ value: false, msg: "" });
  const [error, setError] = useState<string | null>(null);
  const loginForm = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [, setUser] = useContext(UserContext);

  function changeLoginDetails(key: string, value: string) {
    setLoginDetails((prev) => {
      return { ...prev, [key]: value };
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

    setLoading({ value: true, msg: "Logging in" });
    const res = await postFetcher("/api/user/login", loginDetails);
    setLoading({ value: false, msg: "" });

    if (!res) return processError({ name: "not resolved" });
    const { success, data, error } = res;
    if (!success) return processError(error);

    setUser(data);
    router.push("/");
  }

  useEffect(() => {
    loading.value
      ? loginForm.current?.classList.add(styles.OnProgress)
      : loginForm.current?.classList.remove(styles.OnProgress);
  }, [loading]);

  return (
    <div className={`box-width ${styles.LoginForm}`} ref={loginForm}>
      <h1 className={`${styles.Heading} t-medium`}>LOGIN</h1>
      <form name="loginForm" id="loginForm" onSubmit={submitHandler}>
        <div className={styles.InputBox}>
          <Inputr
            label="Username or Email"
            name="user"
            value={loginDetails.user}
            onChange={(val: string) => changeLoginDetails("user", val)}
            required
            placeholder="Enter username or email"
          />
        </div>
        <div className={styles.InputBox}>
          <Passwordr
            name="password"
            required
            value={loginDetails.password}
            onChange={(val: string) => changeLoginDetails("password", val)}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
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
                  <Linkr className={styles.Link} href="/join">
                    create an account ?
                  </Linkr>
                </>
              )}
            </p>
          </div>
        )}
        <div className={styles.InputBox}>
          {!loading.value ? (
            <Submitr form="loginForm">Log in</Submitr>
          ) : (
            <Submitr disabled>
              {loading.msg} <TripleSquareLoader />
            </Submitr>
          )}
        </div>
      </form>
      <div className={styles.footer}>
        <p>Don&apos;t have an account?</p>
        <Linkr className={styles.link} href="/join">
          Create account
        </Linkr>
      </div>
    </div>
  );
};

export default LoginForm;
