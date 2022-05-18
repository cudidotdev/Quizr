import React, { useState } from "react";
import { Option, Searchr, Selectr } from "components/forms";
import styles from "styles/pages/Home.module.css";
import { query } from "..";

const QuizSortForm: React.FC<{
  query: query;
  setQuery: React.Dispatch<React.SetStateAction<query>>;
}> = ({ query, setQuery }) => {
  return (
    <div className={`${styles.SortForm} content-width`}>
      <div className={styles.SearchAndCategoryBox}>
        <div style={{ maxWidth: "420px" }}>
          <Searchr name="quizSearch" />
        </div>
        <div style={{ maxWidth: "420px" }}>
          <Selectr
            name="quizCategory"
            label="Categories"
            multiple
            value={query.categories}
            onChange={(value) =>
              setQuery((prev) => {
                return { ...prev, categories: value };
              })
            }
          >
            <Option value="movies" />
            <Option value="science" />
            <Option value="history" />
            <Option value="geography" />
            <Option value="entertainment & pop culture" />
          </Selectr>
        </div>
      </div>
      <div className={styles.SortBox} style={{ maxWidth: "420px" }}>
        <Selectr
          name="quizSort"
          label="Sort by"
          value={query.sort}
          onChange={(value) =>
            setQuery((prev) => {
              return { ...prev, sort: value };
            })
          }
        >
          <Option value="Most Relevant" />
          <Option value="Hardest" />
          <Option value="Easiest" />
          <Option value="A-Z" />
          <Option value="Z-A" />
        </Selectr>
      </div>
    </div>
  );
};

export default QuizSortForm;
