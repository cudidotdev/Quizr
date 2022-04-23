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
import { useContext, useEffect, useReducer, useState } from "react";
import {
  deleteFetcher,
  getFetcher,
  patchFetcher,
  postFetcher,
} from "utils/fetchers";
import { NotePadContext } from "components/app";
import type { draftAction, draftData } from "types/pages/admin";
import { modifyDraftForDisplay, modifyDraftForSave } from "utils/quiz";
import { doesDiffer } from "utils";

function DraftReducer(state: draftData, action: draftAction): draftData {
  if (
    action.type === "title" ||
    action.type === "introText" ||
    action.type === "categories"
  )
    return { ...state, [action.type]: action.payload };
  if (action.type === "questions") {
    if (state.questions) {
      const idx = state.questions.find(
        (q) => q.index === action.payload.index
      )?.index;
      if (!idx)
        return { ...state, questions: [...state.questions, action.payload] };
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.index === idx ? action.payload : q
        ),
      };
    }
    return { ...state, questions: [action.payload] };
  }
  if (action.type === "all") {
    const { title, introText, categories, questions } = action.payload;
    return { title, introText, categories, questions };
  }
  return state;
}

const QuizEditorPage: NextPageWithLayout = () => {
  const router = useRouter();
  const draftId = router.query.id;
  const addNote = useContext(NotePadContext);

  const [loading, setLoading] = useState(false);
  const [draftData, draftDispatch] = useReducer(DraftReducer, {});

  const [saveloading, setSaveLoading] = useState(false);
  const [prevSaved, setPrevSaved] = useState<draftData>(draftData);
  const [isSaved, setSaved] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

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

    draftDispatch({ type: "all", payload: modifyDraftForDisplay(data) });
  }

  async function saveDraft() {
    setSaveLoading(true);
    const res = await patchFetcher(
      `/api/quiz/draft/edit?id=${draftId}`,
      modifyDraftForSave(draftData)
    );
    setSaveLoading(false);

    if (!res)
      return addNote({
        type: "error",
        msg: "It seems there is a connection error",
        id: `failsavedraft${draftId}`,
      });

    const { success, data: savedData, error } = res;
    if (!success)
      return addNote({
        type: "error",
        msg: error.message,
        id: `errorsavedraft${draftId}`,
      });

    addNote({
      type: "success",
      msg: "Saved successfully",
      id: `successsaveraft${draftId}`,
    });

    const { title, categories, introText, questions } = savedData;
    setPrevSaved(
      modifyDraftForDisplay({ title, categories, introText, questions })
    );
    draftDispatch({ type: "all", payload: modifyDraftForDisplay(savedData) });
    return true;
  }

  async function deleteDraft() {
    setDeleteLoading(true);
    const res = await deleteFetcher(`/api/quiz/draft/delete?id=${draftId}`);
    setDeleteLoading(false);

    if (!res)
      return addNote({
        type: "error",
        msg: "It seems there is a connection error",
        id: `faildeletedraft${draftId}`,
      });

    const { success, data, error } = res;
    if (!success)
      return addNote({
        type: "error",
        msg: error.message,
        id: `errordeletedraft${draftId}`,
      });

    addNote({
      type: "success",
      msg: "Draft deleted successfully",
      id: `successdeletedraft${draftId}`,
    });

    return router.push("/admin/drafts");
  }

  async function publishDraft() {
    setPublishLoading(true);
    if (!isSaved && !(await saveDraft())) return setPublishLoading(false);
    const res = await postFetcher(`/api/quiz/draft/publish?id=${draftId}`, {});
    setPublishLoading(false);

    if (!res)
      return addNote({
        type: "error",
        msg: "It seems there is a connection error",
        id: `failpublishdraft${draftId}`,
      });

    const { success, data, error } = res;

    if (!success)
      return addNote({
        type: "error",
        msg: error.message,
        id: `errorpublishraft${draftId}`,
      });

    addNote({
      type: "success",
      msg: "Draft published successfully",
      id: `successpublishdraft${draftId}`,
    });

    return router.push("/admin/quizzes");
  }

  /*eslint-disable*/
  useEffect(() => {
    if (!doesDiffer(prevSaved, {})) setPrevSaved(draftData);
  }, [draftData]);

  useEffect(() => {
    setSaved(!doesDiffer(draftData, prevSaved));
  }, [draftData, prevSaved]);

  useEffect(() => {
    fetchDraftData();
  }, [draftId]);
  /*eslint-enable*/

  return (
    <main className="site-width" style={{ padding: "0.5rem 1rem 1rem" }}>
      <div className={styles.EditorMenu}>
        <div className={styles.Padder}>
          <DraftExitButton onClick={() => router.push("/admin/drafts")} />
          <DraftSaveButton
            loading={saveloading}
            isSaved={isSaved}
            onClick={saveDraft}
          />
        </div>
        <div className={styles.Padder}>
          <DraftDeleteButton loading={deleteLoading} onClick={deleteDraft} />
          <DraftPublishButton loading={publishLoading} onClick={publishDraft} />
        </div>
      </div>
      <div className={styles.EditorApp}>
        <QuizMetaForm
          loading={loading}
          data={draftData}
          dispatch={draftDispatch}
        />
        <QuizQuestionsForm
          loading={loading}
          data={draftData.questions || []}
          dispatch={draftDispatch}
        />
      </div>
    </main>
  );
};

QuizEditorPage.Layout = AdminLayout;
QuizEditorPage.LayoutProps = { page: "drafts" };
export default QuizEditorPage;
