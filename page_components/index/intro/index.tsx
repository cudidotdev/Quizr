import React from "react";
import { TextBlock } from "components/texts";

const Intro: React.FC = () => {
  return (
    <div className="pad-bottom-one content-width">
      <TextBlock>
        Hi, welcome to Quizr. Take a quiz and test your knowledge on some
        mind-blowing facts.
      </TextBlock>
      <TextBlock>
        Choose one of the quizzes below. You can search for quizzes and sort
        based on category, difficulty or popularity.
      </TextBlock>
    </div>
  );
};

export default Intro;
