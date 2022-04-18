import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";

const AdminStatsPage: NextPageWithLayout = () => {
  return (
    <main className="site-width pad-one">
      <p>Stats</p>
    </main>
  );
};

AdminStatsPage.Layout = AdminLayout;
AdminStatsPage.LayoutProps = { page: "stats" };

export default AdminStatsPage;
