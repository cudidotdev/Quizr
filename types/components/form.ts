import React from "react";
import { defaultProps } from "types/app";

export type inputr = defaultProps & {
  label: string;
  name: string;
  value?: string | number;
  setValue?: (value: string | number) => any;
  type?: React.HTMLInputTypeAttribute;
  Icon?: React.FC;
  clickFn?: () => any;
};

export type searchr = {
  label?: string;
  name: string;
  value?: string | number;
  setValue?: (value: string | number) => any;
  type?: React.HTMLInputTypeAttribute;
  Icon?: React.FC;
  clickFn?: () => any;
};
