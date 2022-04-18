import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";

const AdminUsersPage: NextPageWithLayout = () => {
  return (
    <main className="site-width pad-one">
      <p>Users</p>
    </main>
  );
};

AdminUsersPage.Layout = AdminLayout;
AdminUsersPage.LayoutProps = { page: "users" };

export default AdminUsersPage;
