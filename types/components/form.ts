import React from "react";
import { defaultProps } from "types/app";

export type inputr = defaultProps & {
  label: string;
  name: string;
  value?: string | number;
  onChange?: (value: any) => any;
  type?: React.HTMLInputTypeAttribute;
  Icon?: React.FC;
  clickFn?: () => any;
  required?: boolean;
};

export type searchr = defaultProps & {
  label?: string;
  name: string;
  value?: string | number;
  onChange?: (value: any) => any;
  type?: React.HTMLInputTypeAttribute;
  Icon?: React.FC;
  clickFn?: () => any;
  required?: boolean;
};

export type selectValue = string | number | Array<string | number>;

export type selectr = {
  label?: string;
  name: string;
  value?: selectValue;
  onChange?: (...arg: any) => any;
  multiple?: boolean;
  linear?: boolean;
};

export type multiSelectr = {
  label?: string;
  name: string;
  value?: Array<string | number>;
  onChange?: (...arg: any) => any;
  multiple?: boolean;
  linear?: boolean;
};

export type option = {
  value: string | number;
};

export type pOption = {
  value: string | number;
  selected: boolean;
  toggleSelection: (value: string | number) => any;
};
