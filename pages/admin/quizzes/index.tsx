import { Searchr } from "components/forms";
import { ReloadIcon } from "components/icons";
import { AdminLayout } from "components/layouts";
import ListContainer, { LinkList } from "components/lists";
import { TripleSquareLoader } from "components/loaders";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "types/next";
import { getFetcher } from "utils/fetchers";
import styles from "styles/pages/Admin.module.css";

const AdminQuizzesPage: NextPageWithLayout = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizLoadError, setQuizLoadError] = useState({ val: false, msg: "" });
  const [loading, setLoading] = useState(false);

  async function fetchQuizzes() {
    setLoading(true);
    const res = await getFetcher("/api/quiz");
    setLoading(false);

    if (!res)
      return setQuizLoadError({
        val: true,
        msg: "It seems there is a connection error",
      });

    const { success, data, error } = res;
    if (!success) return setQuizLoadError({ val: true, msg: error.message });

    setQuizLoadError({ val: false, msg: "" });
    setQuizzes(data);
  }

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <main className="site-width" style={{ padding: "0.5rem 1rem 1rem" }}>
      <div style={{ maxWidth: "420px" }}>
        <Searchr name="searchQuizzes" placeholder="Search..." label="" />
      </div>
      {loading ? (
        <div className={styles.MsgContainer}>
          <p className={styles.LoaderBox}>
            Fetching quizzes
            <TripleSquareLoader colored />
          </p>
        </div>
      ) : quizLoadError.val ? (
        <div className={styles.MsgContainer}>
          <p className={styles.ErrorBox}>
            Couldn&apos;t fetch quizzes: {quizLoadError.msg}
          </p>
          <button className={styles.ReloadButton} onClick={fetchQuizzes}>
            Reload
            <span className={styles.Icon}>
              <ReloadIcon />
            </span>
          </button>
        </div>
      ) : quizzes.length ? (
        <ListContainer style={{ padding: "0.5rem 0" }}>
          {quizzes.map((quiz: any) => (
            <LinkList key={quiz._id} href={`/admin/quizzes/${quiz._id}`}>
              {quiz.title}
            </LinkList>
          ))}
        </ListContainer>
      ) : (
        <div className={styles.MsgContainer}>
          <p className={styles.MsgBox}>You have no quizzes</p>
        </div>
      )}
    </main>
  );
};

AdminQuizzesPage.Layout = AdminLayout;
AdminQuizzesPage.LayoutProps = { page: "quizzes" };

export default AdminQuizzesPage;
