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

export type searchr = defaultProps & {
  label?: string;
  name: string;
  value?: string | number;
  setValue?: (value: string | number) => any;
  type?: React.HTMLInputTypeAttribute;
  Icon?: React.FC;
  clickFn?: () => any;
};

export type selectr = {
  label?: string;
  name: string;
  value?: string | number;
  onChange?: (...arg: any) => any;
  multiple?: boolean;
  linear?: boolean;
};
