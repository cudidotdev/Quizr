import { AddIcon } from "components/icons";
import React from "react";
import styles from "styles/pages/Admin.module.css";
import btnStyles from "styles/components/buttons.module.css";

export const CreateQuizButton: React.FC = () => {
  return (
    <button className={`${btnStyles.BtnPrimary} ${btnStyles.BtnIcon}`}>
      <span className={`${btnStyles.Icon}`}>
        <AddIcon />
      </span>
      Create quiz
    </button>
  );
};
