import { BackIcon, FowardIcon } from "components/icons";
import React, { useEffect, useMemo } from "react";
import styles from "styles/components/pagination.module.css";

const Pagination: React.FC<{
  from: number;
  to: number;
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
  style?: React.CSSProperties;
}> = ({ from, to, idx, setIdx, style }) => {
  const n_pages = Math.max(0, to - from + 1);

  /*eslint-disable*/
  const pages = useMemo(() => {
    const arr = [];
    for (let i = 0; i < n_pages; i++) {
      arr.push(from + i);
    }
    return arr;
  }, [n_pages]);
  /*eslint-enable*/

  return (
    <div className={styles.Pagination} style={style}>
      <span
        className={`${styles.Extreme} ${idx === from ? styles.Current : ""}`}
        onClick={() => setIdx((prev) => (prev !== from ? prev - 1 : from))}
      >
        <BackIcon />
      </span>
      {pages.length < 6
        ? pages.map((page) => (
            <span
              key={page}
              className={`${styles.Index} ${
                idx === page ? styles.Current : ""
              }`}
              onClick={() => setIdx(page)}
            >
              {page}
            </span>
          ))
        : pages.map((page, index) => {
            if (
              index < 2 ||
              index === pages.length - 2 ||
              index === pages.length - 1
            )
              return (
                <span
                  key={page}
                  className={`${styles.Index} ${
                    idx === page ? styles.Current : ""
                  }`}
                  onClick={() => setIdx(page)}
                >
                  {page}
                </span>
              );
            if (index === 3)
              return (
                <span key={page} className={`${styles.Dots}`}>
                  &bull;&bull;&bull;
                </span>
              );
            return <></>;
          })}
      <span
        className={`${styles.Extreme} ${idx === to ? styles.Current : ""}`}
        onClick={() => setIdx((prev) => (prev !== to ? prev + 1 : to))}
      >
        <FowardIcon />
      </span>
    </div>
  );
};

export default Pagination;
