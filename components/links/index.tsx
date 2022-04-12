import React from "react";
import Link from "next/link";
import type { linkr } from "types/components/link";

export const Linkr: React.FC<linkr> = (props) => {
  const { href = "#" } = props;
  return (
    <Link href={href}>
      <a {...props}>{props.children}</a>
    </Link>
  );
};
