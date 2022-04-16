import { NextPageWithLayout } from "types/next";
import Layout from "components/layouts";
import NotFoundComponent from "page_components/404";

const NotFoundPage: NextPageWithLayout = () => <NotFoundComponent />;

NotFoundPage.Layout = Layout;
export default NotFoundPage;
