import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";
import styles from "styles/pages/Admin.module.css";
import { CreateQuizButton } from "page_components/admin";

const AdminIndexPage: NextPageWithLayout = () => {
  return (
    <main className="site-width" style={{ padding: "0.5rem 1rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CreateQuizButton />
      </div>
    </main>
  );
};

AdminIndexPage.Layout = AdminLayout;
AdminIndexPage.LayoutProps = { page: "overview" };

export default AdminIndexPage;
