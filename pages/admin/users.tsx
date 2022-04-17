import Layout from "components/layouts";
import { NextPageWithLayout } from "types/next";
import NotFoundComponent from "page_components/404";
import { useContext } from "react";
import { UserContext } from "components/app";
import { AdminNav } from "page_components/admin";
import styles from "styles/pages/Admin.module.css";

const AdminUsersPage: NextPageWithLayout = () => {
  const [user] = useContext(UserContext);

  if (user?.isAdmin !== true) return <NotFoundComponent />;
  return (
    <main className="site-width pad-one">
      <div className={styles.NavPadder}>
        <AdminNav page="users" />
      </div>
    </main>
  );
};

AdminUsersPage.Layout = Layout;
export default AdminUsersPage;
