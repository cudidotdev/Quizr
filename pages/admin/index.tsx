import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";

const AdminIndexPage: NextPageWithLayout = () => {
  return (
    <main className="site-width pad-one">
      <p>Overview</p>
    </main>
  );
};

AdminIndexPage.Layout = AdminLayout;
AdminIndexPage.LayoutProps = { page: "overview" };

export default AdminIndexPage;
