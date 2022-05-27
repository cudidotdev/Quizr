import React from "react";

export interface linkr
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  noIndex?: boolean;
}
