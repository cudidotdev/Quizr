import { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { UserContext } from "components/app";
import { useContext } from "react";
import NotFoundComponent from "page_components/404";
import { AdminNav } from "page_components/admin";
import styles from "styles/pages/Admin.module.css";

const AdminPage: NextPageWithLayout = () => {
  const [user] = useContext(UserContext);

  if (user?.isAdmin !== true) return <NotFoundComponent />;
  return (
    <main className="site-width pad-one">
      <div className={styles.NavPadder}>
        <AdminNav />
      </div>
    </main>
  );
};

AdminPage.Layout = Layout;
export default AdminPage;
