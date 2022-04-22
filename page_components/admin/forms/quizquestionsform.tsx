import React, { useContext, useEffect, useRef, useState } from "react";
import ListContainer, { List } from "components/lists";
import { ModalContext } from "components/app";
import styles from "styles/pages/Admin.module.css";
import { Inputr, Option, Selectr, TextArea } from "components/forms";
import { CancelQuestionButton, AddQuestionButton } from "page_components/admin";
import type { draftAction, draftData, question } from "types/pages/admin";

const QuizQuestionsForm: React.FC<{
  loading: boolean;
  data: question[];
  dispatch: React.Dispatch<draftAction>;
}> = ({ loading, data, dispatch }) => {
  const [runModal] = useContext(ModalContext);

  return (
    <div className={styles.EditorForm}>
      <h2 className={`${styles.Heading} t-medium`}>QUIZ QUESTIONS FORM</h2>
      <ListContainer>
        {loading
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <List
                key={num}
                className={`t-italic`}
                style={{ color: "var(--color-grey-one)", fontSize: "0.9rem" }}
              >
                fetching data ...
              </List>
            ))
          : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const question = data.find((e) => e?.index === num);
              return (
                <List
                  key={num}
                  className={`${styles.QuestionsList}`}
                  onClick={() =>
                    runModal(
                      <QuestionForm
                        data={question}
                        index={num}
                        dispatch={dispatch}
                      />
                    )
                  }
                >
                  {question?.question || ""}
                </List>
              );
            })}
      </ListContainer>
    </div>
  );
};

const QuestionForm: React.FC<{
  data: question | undefined;
  dispatch: React.Dispatch<draftAction>;
  index: number;
}> = ({ data, dispatch, index }) => {
  const optionContainer = useRef<HTMLDivElement>(null);
  const [question, setQuestion] = useState<question>({
    question: "",
    index: index,
    options: { A: "", B: "", C: "", D: "" },
    answer: "A",
  });

  /*eslint-disable */
  useEffect(() => {
    setQuestion({
      question: data?.question || "",
      index: index,
      options: data?.options || { A: "", B: "", C: "", D: "" },
      answer: data?.answer || "A",
    });
  }, [data]);
  /*eslint-enable */

  return (
    <div className={`${styles.QuestionForm} hide-scroll`}>
      <TextArea
        name="question"
        label="Question"
        height="70px"
        value={question.question}
        onChange={(value) =>
          setQuestion((prev) => {
            return { ...prev, question: value };
          })
        }
      />
      <div ref={optionContainer} className={styles.OptionContainer}>
        Options
        <QuestionOption name="A" value={question.options.A} cFn={setQuestion} />
        <QuestionOption name="B" value={question.options.B} cFn={setQuestion} />
        <QuestionOption name="C" value={question.options.C} cFn={setQuestion} />
        <QuestionOption name="D" value={question.options.D} cFn={setQuestion} />
      </div>
      <div style={{ maxWidth: "10rem" }}>
        <Selectr
          name="answer"
          label="Answer"
          value={question.answer}
          onChange={(val) =>
            setQuestion((prev) => {
              return { ...prev, answer: val };
            })
          }
        >
          <Option value="A" />
          <Option value="B" />
          <Option value="C" />
          <Option value="D" />
        </Selectr>
      </div>
      <div className={styles.ButtonBox}>
        <CancelQuestionButton />
        <AddQuestionButton dispatch={dispatch} question={question} />
      </div>
    </div>
  );
};

const QuestionOption: React.FC<{
  name: "A" | "B" | "C" | "D";
  value: string;
  cFn: React.Dispatch<React.SetStateAction<question>>;
}> = ({ name, value, cFn }) => {
  return (
    <div
      className={styles.OptionBox}
      onFocusCapture={(ev) => ev.currentTarget.classList.add(styles.Color)}
      onBlur={(ev) => ev.currentTarget.classList.remove(styles.Color)}
    >
      <div className={styles.OptionName}>{name}:</div>
      <Inputr
        name={`option${name}`}
        value={value}
        onChange={(val) =>
          cFn((prev) => {
            return { ...prev, options: { ...prev.options, [name]: val } };
          })
        }
      />
    </div>
  );
};

export default QuizQuestionsForm;
