import React from "react";
import styles from "styles/pages/Admin.module.css";

const QuizQuestionsForm: React.FC<
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >
> = (props) => {
  return (
    <form {...props} className={styles.EditorForm}>
      <h2 className={`${styles.Heading} t-medium`}>QUIZ QUESTIONS FORM</h2>
    </form>
  );
};

export default QuizQuestionsForm;
