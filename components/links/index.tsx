import React from "react";
import Link from "next/link";
import type { linkr } from "types/components/link";

export const Linkr: React.FC<linkr> = ({
  children,
  href = "#",
  _className = "",
  _style = {},
  passProps,
}) => {
  return (
    <Link href={href}>
      <a className={`${_className}`} style={{ ..._style }} {...passProps}>
        {children}
      </a>
    </Link>
  );
};
