import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";
import styles from "styles/pages/Admin.module.css";
import {
  DeleteButton,
  ExitButton,
  PublishButton,
  SaveButton,
} from "page_components/admin/buttons";

const QuizEditorPage: NextPageWithLayout = () => (
  <main className="site-width" style={{ padding: "0.5rem 1rem" }}>
    <div className={styles.EditorMenu}>
      <div className={styles.Padder}>
        <ExitButton />
        <SaveButton />
      </div>
      <div className={styles.Padder}>
        <DeleteButton />
        <PublishButton />
      </div>
    </div>
  </main>
);

QuizEditorPage.Layout = AdminLayout;
QuizEditorPage.LayoutProps = { page: "drafts" };
export default QuizEditorPage;
