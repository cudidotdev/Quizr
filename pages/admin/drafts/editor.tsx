import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";

const QuizEditorPage: NextPageWithLayout = () => <></>;

QuizEditorPage.Layout = AdminLayout;
QuizEditorPage.LayoutProps = { page: "drafts" };
export default QuizEditorPage;
