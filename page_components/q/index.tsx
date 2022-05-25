import { TripleSquareLoader } from "components/loaders";
import React from "react";
import btnStyles from "styles/components/buttons.module.css";
import styles from "styles/pages/Q.module.css";
import { Linkr } from "components/links";
import { useRouter } from "next/router";
import { FowardIcon } from "components/icons";

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

export const NextButton: React.FC<{ onClick: (...args: any) => any }> = ({
  onClick,
}) => {
  return (
    <button
      className={`${btnStyles.BtnPrimaryX} ${btnStyles.BtnIcon}`}
      style={{ padding: "0.25rem 0.25rem 0.25rem 1rem" }}
      onClick={onClick}
    >
      <span>Next</span>
      <span className={btnStyles.IconRight}>
        <FowardIcon />
      </span>
    </button>
  );
};

export const SubmitButton: React.FC<{
  loading: boolean;
  onClick: (...args: any) => any;
}> = ({ loading, onClick }) => {
  if (loading)
    return (
      <button
        className={`${btnStyles.BtnPrimary} ${btnStyles.BtnLoading} ${styles.SubmitBtn}`}
      >
        Submitting <TripleSquareLoader />
      </button>
    );
  return (
    <button
      className={`${btnStyles.BtnPrimary} ${styles.SubmitBtn}`}
      style={{ padding: "0.25rem 1.5rem" }}
      onClick={onClick}
    >
      Submit
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
          ) : msg === "You have already taken this quiz" ? (
            <>
              {msg},{" "}
              <Linkr
                className={styles.Link}
                href={`/q/${router.query.urlName || ""}/result`}
              >
                View result.
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

export const Option: React.FC<{
  question: { [key: string]: any };
  value: "A" | "B" | "C" | "D";
  onClick: (...args: any) => any;
  colored: boolean;
}> = ({ question, value, onClick, colored }) => {
  return (
    <button
      className={`${styles.Option} ${colored ? styles.Colored : ""}`}
      onClick={onClick}
    >
      <span className={styles.Index}>{value}</span>
      <span className={styles.Text}> {question?.options[value]}</span>
    </button>
  );
};

export const Nav: React.FC<{
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
  answered: boolean;
  pending: boolean;
}> = ({ idx, setIdx, answered, pending }) => {
  return (
    <button
      className={`${styles.Index} ${answered ? styles.Answered : ""} ${
        pending ? styles.Pending : ""
      }`}
      onClick={() => setIdx(idx)}
    >
      {idx}
    </button>
  );
};

export { default as Header } from "./header";
