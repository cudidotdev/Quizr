import type { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { useContext, useEffect, useState } from "react";
import { deleteFetcher } from "utils/fetchers";
import { NotePadContext, UserContext } from "components/app";
import { useRouter } from "next/router";
import styles from "styles/pages/Out.module.css";
import { TripleSquareLoader } from "components/loaders";

const LogoutPage: NextPageWithLayout = () => {
  const [msg, setMsg] = useState({ name: "running", value: "Good Bye" });
  const [, setUser] = useContext(UserContext);
  const addNote = useContext(NotePadContext);
  const router = useRouter();

  async function logout() {
    document.body.style.cursor = "progress";
    const data = await deleteFetcher("/api/user/logout");
    document.body.style.cursor = "default";

    if (!data)
      return setMsg({
        name: "error",
        value: "It seems there is a connection error",
      });

    const { success, error } = data;
    if (!success) return setMsg({ name: "error", value: error.message });

    addNote({ type: "info", id: "logoutmsg", msg: "Logged out successfully" });

    setUser(null);
    router.push("/");
  }

  /* eslint-disable */
  useEffect(() => {
    logout();
  }, []);
  /* eslint-enable */

  return (
    <main className="content-width pad-one">
      {msg.name === "running" && (
        <p className={`${styles.Msg} t-light`}>
          <TripleSquareLoader colored />
          <span style={{ padding: "0.125rem" }}></span>
          {msg.value}
        </p>
      )}
      {msg.name === "error" && (
        <p className={`${styles.Msg} ${styles.Error} t-light`}>{msg.value}</p>
      )}
    </main>
  );
};

LogoutPage.Layout = Layout;

export default LogoutPage;
