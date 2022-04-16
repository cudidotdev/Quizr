import { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import { UserContext } from "components/app";
import { useContext } from "react";
import NotFoundComponent from "page_components/404";

const AdminPage: NextPageWithLayout = () => {
  const [user] = useContext(UserContext);

  if (user?.isAdmin !== true) return <NotFoundComponent />;
  return <></>;
};

AdminPage.Layout = Layout;
export default AdminPage;
