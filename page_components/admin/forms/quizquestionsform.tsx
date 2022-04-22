import React, { useContext, useRef } from "react";
import ListContainer, { List } from "components/lists";
import { ModalContext } from "components/app";
import styles from "styles/pages/Admin.module.css";
import { Inputr, Option, Selectr, TextArea } from "components/forms";
import { CancelQuestionButton, AddQuestionButton } from "page_components/admin";

const QuizQuestionsForm: React.FC<{}> = ({}) => {
  const [runModal, removeModal] = useContext(ModalContext);

  return (
    <div className={styles.EditorForm}>
      <h2 className={`${styles.Heading} t-medium`}>QUIZ QUESTIONS FORM</h2>
      <ListContainer>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <List
            key={num}
            className={styles.QuestionsList}
            onClick={() => runModal(<QuestionForm />)}
          ></List>
        ))}
      </ListContainer>
    </div>
  );
};

const QuestionForm: React.FC = () => {
  const optionContainer = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles.QuestionForm} hide-scroll`}>
      <TextArea name="question" label="Question" height="70px" />
      <div ref={optionContainer} className={styles.OptionContainer}>
        Options
        <QuestionOption name="A" />
        <QuestionOption name="B" />
        <QuestionOption name="C" />
        <QuestionOption name="D" />
      </div>
      <div style={{ maxWidth: "240px" }}>
        <Selectr name="answer" label="Answer">
          <Option value="A" />
          <Option value="B" />
          <Option value="C" />
          <Option value="D" />
        </Selectr>
      </div>
      <div className={styles.ButtonBox}>
        <CancelQuestionButton />
        <AddQuestionButton />
      </div>
    </div>
  );
};

const QuestionOption: React.FC<{ name: "A" | "B" | "C" | "D" }> = ({
  name,
}) => {
  return (
    <div
      className={styles.OptionBox}
      onFocusCapture={(ev) => ev.currentTarget.classList.add(styles.Color)}
      onBlur={(ev) => ev.currentTarget.classList.remove(styles.Color)}
    >
      <div className={styles.OptionName}>{name}:</div>
      <Inputr name={`option${name}`} />
    </div>
  );
};

export default QuizQuestionsForm;
