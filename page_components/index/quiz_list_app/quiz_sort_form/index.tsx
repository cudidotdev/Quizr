import React from "react";
import { Option, Searchr, Selectr } from "components/forms";
import styles from "styles/pages/Home.module.css";

const QuizSortForm: React.FC = () => {
  return (
    <div className={styles.SortForm}>
      <div className={styles.SearchAndCategoryBox}>
        <div>
          <Searchr
            name="quizSearch"
            passProps={{
              onKeyPress: (ev: any) =>
                ev.key === "Enter" && console.log("click"),
            }}
          />
        </div>
        <div>
          <Selectr
            name="quizCategory"
            label="Categories"
            value={["Movies", "Science"]}
            multiple
          >
            <Option value="Movies" />
            <Option value="Science" />
            <Option value="History" />
            <Option value="Geography" />
            <Option value="Entertainment & pop culture" />
          </Selectr>
        </div>
      </div>
      <div className={styles.SortBox}>
        <Selectr name="quizSort" label="Sort By">
          <Option value="Popularity" />
          <Option value="Difficulty" />
          <Option value="A-Z" />
        </Selectr>
      </div>
    </div>
  );
};

export default QuizSortForm;
