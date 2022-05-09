import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";
import { GetStaticProps, GetStaticPaths } from "next";
import connectDB from "database/connect";
import { Quiz } from "database/models";
import { quiz } from "types/app";
import {
  EditQuizButton,
  DeleteQuizButton,
  EditQuizButtonS,
  DeleteQuizButtonS,
} from "page_components/admin";
import { useContext, useState } from "react";
import { NotePadContext } from "components/app";
import { deleteFetcher, putFetcher } from "utils/fetchers";
import { useRouter } from "next/router";
import styles from "styles/pages/Admin_Quizzes.module.css";

//@ts-ignore
const AdminQuizIdPage: NextPageWithLayout = ({ quiz }: { quiz: quiz }) => {
  const { title, categories, introText, questions, _id: id } = quiz;
  const addNote = useContext(NotePadContext);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  async function editQuiz() {
    setEditLoading(true);
    const res = await putFetcher(`/api/quiz/edit?id=${id}`, {});
    setEditLoading(false);

    if (!res)
      return addNote({
        type: "error",
        id: `erroreditquiz${id}`,
        msg: "It seems there is a connection problem",
      });

    const { success, data, error } = res;

    if (!success)
      return addNote({
        type: "error",
        msg: error.message,
        id: `faileditquiz${id}`,
      });

    router.push(`/admin/drafts/editor?id=${data.id}`);
  }

  async function deleteQuiz() {
    setDeleteLoading(true);
    const res = await deleteFetcher(`/api/quiz/delete?id=${id}`, {});
    setDeleteLoading(false);

    if (!res)
      return addNote({
        type: "error",
        id: `errordeletequiz${id}`,
        msg: "It seems there is a connection problem",
      });

    const { success, data, error } = res;

    if (!success)
      return addNote({
        type: "error",
        msg: error.message,
        id: `faildeletequiz${id}`,
      });

    addNote({
      type: "success",
      id: `successdeletequiz${id}`,
      msg: "Quiz deleted successfully",
    });

    router.push(`/admin/quizzes`);
  }

  return (
    <main className="site-width pad-one">
      <div className={styles.ButtonNav}>
        <div className={styles.Large}>
          <DeleteQuizButton loading={deleteLoading} onClick={deleteQuiz} />
          <EditQuizButton loading={editLoading} onClick={editQuiz} />
        </div>
        <div className={styles.Small}>
          <DeleteQuizButtonS loading={deleteLoading} onClick={deleteQuiz} />
          <EditQuizButtonS loading={editLoading} onClick={editQuiz} />
        </div>
      </div>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  await connectDB();

  const quizzes: quiz[] = await Quiz.find({}).select("urlName").lean();
  const paths = quizzes.map((quiz) => {
    return { params: { urlName: quiz.urlName } };
  });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await connectDB();

  const quiz: quiz = await Quiz.findOne({ urlName: params!.urlName })
    .select("title categories introText")
    .lean();
  if (!quiz) return { notFound: true };

  quiz._id = quiz._id.toString();
  return { props: { quiz } };
};

AdminQuizIdPage.Layout = AdminLayout;
AdminQuizIdPage.LayoutProps = { page: "quizzes" };

export default AdminQuizIdPage;
