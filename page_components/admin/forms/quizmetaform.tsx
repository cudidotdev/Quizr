import React from "react";
import { Inputr, TextArea } from "components/forms";
import styles from "styles/pages/Admin.module.css";
import type { draftData, draftAction } from "types/pages/admin";

const QuizMetaForm: React.FC<{
  loading: boolean;
  data: draftData;
  dispatch: React.Dispatch<draftAction>;
}> = ({ loading, data, dispatch }) => {
  return (
    <form className={styles.EditorForm}>
      <h2 className={`${styles.Heading} t-medium`}>QUIZ META FORM</h2>
      <Inputr
        name="title"
        label="Title"
        placeholder={`${loading ? "fetching data ..." : ""}`}
        className={`${loading ? "t-italic" : ""}`}
        value={`${data.title ? data.title : ""}`}
        onChange={(value) => dispatch({ type: "title", payload: value })}
      />
      <Inputr
        name="categories"
        label="Categories"
        className={`${loading ? "t-italic" : ""}`}
        placeholder={`${loading ? "fetching data ..." : ""}`}
        value={`${data.categories ? data.categories : ""}`}
        onChange={(value) => dispatch({ type: "categories", payload: value })}
      />
      <TextArea
        name="introText"
        label="Introductory Text"
        height="420px"
        className={`${loading ? "t-italic" : ""}`}
        placeholder={`${loading ? "fetching data ..." : ""}`}
        value={`${data.introText ? data.introText : ""}`}
        onChange={(value) => dispatch({ type: "introText", payload: value })}
      />
    </form>
  );
};

export default QuizMetaForm;
