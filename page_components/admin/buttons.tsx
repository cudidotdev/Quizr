import { NotePadContext } from "components/app";
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
import { deleteFetcher, postFetcher } from "utils/fetchers";

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

export const DraftSaveButton: React.FC<{ id: any }> = ({ id }) => {
  return (
    <button className={`${btnStyles.BtnIcon} ${btnStyles.BtnSecondaryX}`}>
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
        onClick={deleteDraft}
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
