import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";

const AdminQuizzesPage: NextPageWithLayout = () => {
  return (
    <main className="site-width pad-one">
      <p>Quizzes</p>
    </main>
  );
};

AdminQuizzesPage.Layout = AdminLayout;
AdminQuizzesPage.LayoutProps = { page: "quizzes" };

export default AdminQuizzesPage;
