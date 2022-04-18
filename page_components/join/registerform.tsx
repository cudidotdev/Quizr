import { Inputr, Passwordr, Submitr } from "components/forms";
import { Linkr } from "components/links";
import { TripleSquareLoader } from "components/loaders";
import { useRouter } from "next/router";
import React, { useRef, useEffect, useState, useContext } from "react";
import styles from "styles/pages/In.module.css";
import { postFetcher } from "utils/fetchers";
import { NotePadContext, UserContext } from "components/app";

type registerDetails = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm: React.FC = () => {
  const [regDetails, setRegDetails] = useState<registerDetails>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState({ value: false, msg: "" });
  const [error, setError] = useState<string | null>(null);
  const registerForm = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [, setUser] = useContext(UserContext);
  const addNote = useContext(NotePadContext);

  function changeRegDetails(key: string, value: string) {
    setRegDetails((prev) => {
      return { ...prev, [key]: value };
    });
  }

  function processError(error: any) {
    const { name, message } = error;

    if (name === "not resolved")
      return setError("It seems there is a connection error");
    if (["username", "email", "password", "confirmPassword"].includes(name)) {
      //@ts-ignore
      document.registerForm[name].focus();
      return setError(message);
    }
    return setError("Unkwown server error, please try again");
  }

  async function submitHandler(ev: any) {
    ev.preventDefault();

    setLoading({ value: true, msg: "Registering" });
    const res = await postFetcher("/api/user/create", regDetails);
    setLoading({ value: false, msg: "" });

    if (!res) return processError({ name: "not resolved" });
    const { success, data, error } = res;
    if (!success) return processError(error);

    addNote({ msg: "Registration successful", id: "regsuccess", type: "info" });

    setLoading({ value: true, msg: "Logging in" });
    const { username, password } = regDetails;
    const loginRes = await postFetcher("/api/user/login", {
      user: username,
      password,
    });
    setLoading({ value: false, msg: "" });

    if (!loginRes) return processError({ name: "not resolved" });
    const {
      success: loginSuccess,
      data: loginData,
      error: loginError,
    } = loginRes;
    if (!loginSuccess) return processError(loginError);

    setUser(loginData);
    addNote({
      msg: "Logged in successfully",
      id: "loginsuccess",
      type: "info",
    });
    router.push("/");
  }

  useEffect(() => {
    loading.value
      ? registerForm.current?.classList.add(styles.OnProgress)
      : registerForm.current?.classList.remove(styles.OnProgress);
  }, [loading]);

  return (
    <div className={`box-width ${styles.LoginForm}`} ref={registerForm}>
      <h1 className={`${styles.Heading} t-medium`}>REGISTER</h1>
      <form name="registerForm" id="registerForm" onSubmit={submitHandler}>
        <div className={styles.InputBox}>
          <Inputr
            label="Username"
            name="username"
            value={regDetails.username}
            onChange={(val: string) => changeRegDetails("username", val)}
            placeholder="Choose a username"
            required
          />
        </div>
        <div className={styles.InputBox}>
          <Inputr
            label="Email"
            name="email"
            type="email"
            value={regDetails.email}
            onChange={(val: string) => changeRegDetails("email", val)}
            placeholder="Choose an email"
            required
          />
        </div>
        <div className={styles.InputBox}>
          <Passwordr
            name="password"
            required
            value={regDetails.password}
            onChange={(val: string) => changeRegDetails("password", val)}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          />
        </div>
        <div className={styles.InputBox}>
          <Passwordr
            label="Confirm Password"
            name="confirmPassword"
            required
            value={regDetails.confirmPassword}
            onChange={(val: string) => changeRegDetails("confirmPassword", val)}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          />
        </div>
        {!!error && (
          <div className={`${styles.InputBox} ${styles.ErrorMsg}`}>
            <span className={`${styles.Icon} t-medium`}>!</span>
            <p className={styles.Msg}>{error}.</p>
          </div>
        )}
        <div className={styles.InputBox}>
          {!loading.value ? (
            <Submitr form="registerForm">Register</Submitr>
          ) : (
            <Submitr disabled>
              {loading.msg} <TripleSquareLoader />
            </Submitr>
          )}
        </div>
      </form>
      <div className={styles.footer}>
        <p>Already have an account?</p>
        <Linkr className={styles.link} href="/in">
          Log in
        </Linkr>
      </div>
    </div>
  );
};

export default RegisterForm;
