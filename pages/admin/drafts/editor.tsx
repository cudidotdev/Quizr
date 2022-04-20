import { AdminLayout } from "components/layouts";
import { NextPageWithLayout } from "types/next";
import styles from "styles/pages/Admin.module.css";
import {
  DraftDeleteButton,
  DraftExitButton,
  DraftPublishButton,
  DraftSaveButton,
  QuizMetaForm,
  QuizQuestionsForm,
} from "page_components/admin";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getFetcher } from "utils/fetchers";
import { NotePadContext } from "components/app";

const QuizEditorPage: NextPageWithLayout = () => {
  const router = useRouter();
  const draftId = router.query.id;
  const [loading, setLoading] = useState(false);
  const addNote = useContext(NotePadContext);
  const [draftData, setDraftData] = useState<any>();

  async function fetchDraftData() {
    if (!draftId) return;

    setLoading(true);
    const res = await getFetcher(`/api/quiz/draft?id=${draftId}`);
    setLoading(false);

    if (!res)
      return addNote({
        type: "error",
        msg: "It seems there is a connection error",
        id: `failfetchdraftdata${draftId}`,
      });

    const { success, data, error } = res;

    if (!success)
      return addNote({
        type: "error",
        msg: error.message,
        id: `errorfetchdraftdata${draftId}`,
      });

    return setDraftData(data);
  }

  /*eslint-disable*/
  useEffect(() => {
    fetchDraftData();
  }, [draftId]);
  /*eslint-enable*/

  return (
    <main className="site-width" style={{ padding: "0.5rem 1rem" }}>
      <div className={styles.EditorMenu}>
        <div className={styles.Padder}>
          <DraftExitButton />
          <DraftSaveButton id={draftId} />
        </div>
        <div className={styles.Padder}>
          <DraftDeleteButton id={draftId} />
          <DraftPublishButton id={draftId} />
        </div>
      </div>
      <div className={styles.EditorApp}>
        <QuizMetaForm loading={loading} draftData={draftData} />
        <QuizQuestionsForm />
      </div>
    </main>
  );
};

QuizEditorPage.Layout = AdminLayout;
QuizEditorPage.LayoutProps = { page: "drafts" };
export default QuizEditorPage;
