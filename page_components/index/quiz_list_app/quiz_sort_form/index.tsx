import React from "react";
import { Option, Searchr, Selectr } from "components/forms";

const QuizSortForm: React.FC = () => {
  return (
    <div className="card-one rad-quart pad-one">
      <Searchr name="quizSearch" />
      <Selectr name="quizCategory" label="Categories" multiple>
        <Option>Movies</Option>
        <Option>Science</Option>
        <Option>History</Option>
        <Option>Geography</Option>
        <Option>Culture</Option>
        <Option>Music</Option>
      </Selectr>
      <Searchr name="quizSearcher" />
    </div>
  );
};

export default QuizSortForm;
