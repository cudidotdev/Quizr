import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";

const AdminDraftsPage: NextPageWithLayout = () => {
  return (
    <main className="site-width pad-one">
      <p>Drafts</p>
    </main>
  );
};

AdminDraftsPage.Layout = AdminLayout;
AdminDraftsPage.LayoutProps = { page: "drafts" };

export default AdminDraftsPage;
