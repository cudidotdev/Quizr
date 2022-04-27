import { TripleSquareLoader } from "components/loaders";
import React from "react";
import btnStyles from "styles/components/buttons.module.css";
import styles from "styles/pages/Q.module.css";
import { Linkr } from "components/links";
import { useRouter } from "next/router";

export const StartButton: React.FC<{
  loading: boolean;
  onClick: (...args: any) => any;
}> = ({ loading, onClick }) => {
  if (loading)
    return (
      <button
        className={`${btnStyles.BtnPrimary} ${styles.StartBtn} ${btnStyles.BtnLoading}`}
      >
        Starting <TripleSquareLoader />
      </button>
    );
  return (
    <button
      className={`${btnStyles.BtnPrimary} ${styles.StartBtn}`}
      onClick={onClick}
    >
      Start
    </button>
  );
};

export const ErrorMsg: React.FC<{ msg: string }> = ({ msg }) => {
  const router = useRouter();
  return (
    <div className={styles.ErrorBox}>
      <div className={styles.Padder}>
        <div className={styles.Icon}>!</div>
        <div className={styles.Msg}>
          {msg === "No user is logged-in currently" ? (
            <>
              You aren&apos;t logged in yet.{" "}
              <Linkr
                className={styles.Link}
                href={`/in?next=q/${router.query.urlName || ""}`}
              >
                Click to log in.
              </Linkr>
            </>
          ) : (
            msg
          )}
        </div>
      </div>
    </div>
  );
};
