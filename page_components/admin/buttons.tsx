import { ModalContext, NotePadContext } from "components/app";
import {
  AddIcon,
  DeleteIcon,
  ExitIcon,
  PublishIcon,
  SaveIcon,
} from "components/icons";
import { TripleSquareLoader } from "components/loaders";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import btnStyles from "styles/components/buttons.module.css";
import { draftAction, draftData } from "types/pages/admin";
import { deleteFetcher, patchFetcher, postFetcher } from "utils/fetchers";
import { modifyDraftForDisplay, modifyDraftForSave } from "utils/quiz";

export const CreateQuizButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const addNote = useContext(NotePadContext);

  async function createQuiz(ev?: any) {
    ev.preventDefault();

    setLoading(true);
    const res = await postFetcher("/api/quiz/draft/create", {});
    setLoading(false);

    if (!res)
      return addNote({
        type: "error",
        msg: "it seems there is a connection error",
        id: "button_5324",
      });

    const { success, data, error } = res;

    if (!success)
      return addNote({
        type: "error",
        msg: error.message,
        id: "button_5424",
      });

    addNote({
      type: "success",
      msg: "Quiz Created",
      id: "quizcreated324",
    });
    return router.push(`/admin/drafts/editor?id=${data._id}`);
  }

  if (loading)
    return (
      <button
        className={`${btnStyles.BtnPrimary} ${btnStyles.BtnIcon} ${btnStyles.BtnLoading}`}
      >
        <span className={`${btnStyles.Icon}`}>
          <AddIcon />
        </span>
        Creating <TripleSquareLoader />
      </button>
    );
  return (
    <button
      className={`${btnStyles.BtnPrimary} ${btnStyles.BtnIcon}`}
      onClick={createQuiz}
    >
      <span className={`${btnStyles.Icon}`}>
        <AddIcon />
      </span>
      Create quiz
    </button>
  );
};

export const DraftExitButton: React.FC = () => {
  const router = useRouter();
  return (
    <button
      className={`${btnStyles.BtnIcon} ${btnStyles.BtnTertiaryX}`}
      onClick={() => router.push("/admin/drafts")}
    >
      <span className={btnStyles.Icon}>
        <ExitIcon />
      </span>
      Exit
    </button>
  );
};

export const DraftSaveButton: React.FC<{
  id: any;
  data: draftData;
  dispatch: React.Dispatch<draftAction>;
}> = ({ id, data, dispatch }) => {
  const [loading, setLoading] = useState(false);
  const addNote = useContext(NotePadContext);

  async function saveDraft() {
    setLoading(true);
    const res = await patchFetcher(
      `/api/quiz/draft/edit?id=${id}`,
      modifyDraftForSave(data)
    );
    setLoading(false);

    if (!res)
      return addNote({
        type: "error",
        msg: "It seems there is a connection error",
        id: `failsavedraft${id}`,
      });

    const { success, data: savedData, error } = res;
    if (!success)
      return addNote({
        type: "error",
        msg: error.message,
        id: `errorsavedraft${id}`,
      });

    addNote({
      type: "success",
      msg: "Saved successfully",
      id: `successsaveraft${id}`,
    });

    dispatch({ type: "all", payload: modifyDraftForDisplay(savedData) });
  }
  if (loading)
    return (
      <button
        className={`${btnStyles.BtnIcon} ${btnStyles.BtnSecondaryX} ${btnStyles.BtnLoading}`}
      >
        <span className={btnStyles.Icon}>
          <SaveIcon />
        </span>
        Saving <TripleSquareLoader s_colored />
      </button>
    );
  return (
    <button
      className={`${btnStyles.BtnIcon} ${btnStyles.BtnSecondaryX}`}
      onClick={saveDraft}
    >
      <span className={btnStyles.Icon}>
        <SaveIcon />
      </span>
      Save
    </button>
  );
};

export const DraftDeleteButton: React.FC<{ id: any }> = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const addNote = useContext(NotePadContext);
  const router = useRouter();

  async function deleteDraft() {
    setLoading(true);
    const res = await deleteFetcher(`/api/quiz/draft/delete?id=${id}`);
    setLoading(false);

    if (!res)
      return addNote({
        type: "error",
        msg: "It seems there is a connection error",
        id: `faildeletedraft${id}`,
      });

    const { success, data, error } = res;
    if (!success)
      return addNote({
        type: "error",
        msg: error.message,
        id: `errordeletedraft${id}`,
      });

    addNote({
      type: "success",
      msg: "Draft deleted successfully",
      id: `successdeletedraft${id}`,
    });

    return router.push("/admin/drafts");
  }

  if (loading)
    return (
      <button
        className={`${btnStyles.BtnIcon} ${btnStyles.BtnTertiaryX} ${btnStyles.BtnLoading}`}
      >
        <span className={btnStyles.Icon}>
          <DeleteIcon />
        </span>
        Deleting <TripleSquareLoader t_colored />
      </button>
    );

  return (
    <button
      className={`${btnStyles.BtnIcon} ${btnStyles.BtnTertiaryX}`}
      onClick={deleteDraft}
    >
      <span className={btnStyles.Icon}>
        <DeleteIcon />
      </span>
      Delete
    </button>
  );
};

export const DraftPublishButton: React.FC<{ id: any }> = ({ id }) => {
  return (
    <button className={`${btnStyles.BtnIcon} ${btnStyles.BtnSecondaryX}`}>
      <span className={btnStyles.Icon}>
        <PublishIcon />
      </span>
      Publish
    </button>
  );
};

export const CancelQuestionButton: React.FC = () => {
  const [, removeModal] = useContext(ModalContext);
  return (
    <button className={`${btnStyles.BtnTertiaryX}`} onClick={removeModal}>
      Cancel
    </button>
  );
};

export const AddQuestionButton: React.FC = () => {
  const [, removeModal] = useContext(ModalContext);
  return (
    <button className={`${btnStyles.BtnSecondaryX}`} onClick={removeModal}>
      Add
    </button>
  );
};
