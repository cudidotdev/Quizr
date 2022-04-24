import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";

const AdminQuizIdPage: NextPageWithLayout = () => {
  return (
    <main className="site-width pad-one">
      <p>Building...</p>
    </main>
  );
};

AdminQuizIdPage.Layout = AdminLayout;
AdminQuizIdPage.LayoutProps = { page: "quizzes" };

export default AdminQuizIdPage;
