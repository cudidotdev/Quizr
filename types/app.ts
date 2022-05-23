import React from "react";

export type defaultProps = {
  _className?: string;
  _style?: React.CSSProperties;
  passProps?: { [key: string]: any };
};

export type quiz = {
  _id: string;
  title: string;
  categories: string;
  introText: string;
  urlName: string;
  questions: question[];
};

export type quizType2 = {
  _id: string;
  title: string;
  categories: string[];
  introText: string;
  urlName: string;
  questions: question[];
  averageScore?: number;
};

type question = {
  question: string;
  index: number;
  options: { A: string; B: string; C: string; D: string };
  answer?: ans;
};

export type ans = "A" | "B" | "C" | "D";

export type searchIndex = {
  [name: string]: { quizId: string; score: number }[];
};
