import React, { useState } from "react";
import { Option, Searchr, Selectr } from "components/forms";
import styles from "styles/pages/Home.module.css";

const QuizSortForm: React.FC = () => {
  return (
    <div className={`${styles.SortForm} content-width`}>
      <div className={styles.SearchAndCategoryBox}>
        <div style={{ maxWidth: "420px" }}>
          <Searchr name="quizSearch" />
        </div>
        <div style={{ maxWidth: "420px" }}>
          <Selectr name="quizCategory" label="Categories" multiple>
            <Option value="Movies" />
            <Option value="Science" />
            <Option value="History" />
            <Option value="Geography" />
            <Option value="Entertainment & pop culture" />
          </Selectr>
        </div>
      </div>
      <div className={styles.SortBox} style={{ maxWidth: "420px" }}>
        <Selectr name="quizSort" label="Sort by">
          <Option value="Popularity" />
          <Option value="Difficulty" />
          <Option value="A-Z" />
        </Selectr>
      </div>
    </div>
  );
};

export default QuizSortForm;
