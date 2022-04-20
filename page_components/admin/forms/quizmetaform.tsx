import React from "react";
import { Inputr, TextArea } from "components/forms";
import styles from "styles/pages/Admin.module.css";

const QuizMetaForm: React.FC<any> = ({ loading, draftData }) => {
  return (
    <form className={styles.EditorForm}>
      <h2 className={`${styles.Heading} t-medium`}>QUIZ META FORM</h2>
      <Inputr
        name="title"
        label="Title"
        placeholder={`${loading ? "fetching draft data" : ""}`}
        className={`${loading ? "t-italic" : ""}`}
        value={`${draftData ? draftData.title : ""}`}
      />
      <Inputr
        name="categories"
        label="Categories"
        className={`${loading ? "t-italic" : ""}`}
        placeholder={`${loading ? "fetching draft data" : ""}`}
      />
      <TextArea
        name="introText"
        label="Intro Text"
        height="420px"
        className={`${loading ? "t-italic" : ""}`}
        placeholder={`${loading ? "fetching draft data" : ""}`}
      />
    </form>
  );
};

export default QuizMetaForm;
