import { ModalContext, NotePadContext } from "components/app";
import {
  AddIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
  ExitIcon,
  PublishIcon,
  SaveIcon,
} from "components/icons";
import { TripleSquareLoader } from "components/loaders";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import btnStyles from "styles/components/buttons.module.css";
import { postFetcher, putFetcher } from "utils/fetchers";

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
        Creating <TripleSquareLoader colored />
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

export const DraftExitButton: React.FC<{ onClick: (...args: any) => any }> = ({
  onClick,
}) => {
  return (
    <button
      className={`${btnStyles.BtnIcon} ${btnStyles.BtnTertiaryX}`}
      onClick={onClick}
    >
      <span className={btnStyles.Icon}>
        <ExitIcon />
      </span>
      Exit
    </button>
  );
};

export const DraftSaveButton: React.FC<{
  loading: boolean;
  isSaved: boolean;
  onClick: (...args: any) => any;
}> = ({ loading, isSaved, onClick }) => {
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

  if (isSaved)
    return (
      <button
        className={`${btnStyles.BtnIcon} ${btnStyles.BtnSecondaryX}`}
        style={{ cursor: "default" }}
      >
        <span className={btnStyles.Icon}>
          <CheckIcon />
        </span>
        Saved
      </button>
    );

  return (
    <button
      className={`${btnStyles.BtnIcon} ${btnStyles.BtnSecondaryX}`}
      onClick={onClick}
    >
      <span className={btnStyles.Icon}>
        <SaveIcon />
      </span>
      Save
    </button>
  );
};

export const DraftDeleteButton: React.FC<{
  loading: boolean;
  onClick: (...args: any) => any;
}> = ({ loading, onClick }) => {
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
      onClick={onClick}
    >
      <span className={btnStyles.Icon}>
        <DeleteIcon />
      </span>
      Delete
    </button>
  );
};

export const DraftPublishButton: React.FC<{
  loading: boolean;
  onClick: (...args: any) => any;
}> = ({ loading, onClick }) => {
  if (loading)
    return (
      <button
        className={`${btnStyles.BtnIcon} ${btnStyles.BtnSecondaryX} ${btnStyles.BtnLoading}`}
      >
        <span className={btnStyles.Icon}>
          <PublishIcon />
        </span>
        Publishing <TripleSquareLoader s_colored />
      </button>
    );

  return (
    <button
      className={`${btnStyles.BtnIcon} ${btnStyles.BtnSecondaryX}`}
      onClick={onClick}
    >
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
    <button
      className={`${btnStyles.BtnTertiaryX}`}
      onClick={removeModal}
      type="button"
    >
      Cancel
    </button>
  );
};

export const AddQuestionButton: React.FC = () => {
  return (
    <button className={`${btnStyles.BtnSecondaryX}`} type="submit">
      Add
    </button>
  );
};

export const EditQuizButton: React.FC<{
  loading: boolean;
  onClick: (...args: any) => any;
}> = ({ loading, onClick }) => {
  if (loading)
    return (
      <button
        className={`${btnStyles.BtnPrimaryX} ${btnStyles.BtnIcon} ${btnStyles.BtnLoading}`}
      >
        <span className={btnStyles.Icon}>
          <EditIcon />
        </span>
        Preparing <TripleSquareLoader colored />
      </button>
    );

  return (
    <button
      className={`${btnStyles.BtnPrimaryX} ${btnStyles.BtnIcon}`}
      onClick={onClick}
    >
      <span className={btnStyles.Icon}>
        <EditIcon />
      </span>
      Edit quiz
    </button>
  );
};
