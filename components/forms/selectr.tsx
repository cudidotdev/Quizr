import { AddIcon, CloseIcon } from "components/icons";
import React, { useEffect, useRef, useState } from "react";
import styles from "styles/components/forms.module.css";
import type {
  selectr,
  option,
  pOption,
  multiSelectr,
} from "types/components/form";

export const Option: React.FC<option> = () => <></>;

const Selectr: React.FC<selectr> = ({
  label,
  name,
  value,
  linear,
  multiple,
  onChange = () => {},
  children,
}) => {
  if (linear && multiple)
    return (
      <LinearMultipleSelectr
        label={label}
        value={Array.isArray(value) ? value : []}
        name={name}
        onChange={onChange}
      >
        {children}
      </LinearMultipleSelectr>
    );
  if (multiple)
    return (
      <MultipleSelectr
        label={label}
        value={Array.isArray(value) ? value : []}
        name={name}
        onChange={onChange}
      >
        {children}
      </MultipleSelectr>
    );
  if (linear)
    return (
      <LinearSelectr
        label={label}
        value={value}
        name={name}
        onChange={onChange}
      >
        {children}
      </LinearSelectr>
    );
  return (
    <DefaultSelectr label={label} name={name} value={value} onChange={onChange}>
      {children}
    </DefaultSelectr>
  );
};

export default Selectr;

const DefaultSelectr: React.FC<selectr> = ({
  children,
  label,
  value,
  name,
  onChange = () => {},
}) => {
  const selectr = useRef<HTMLDivElement>(null);
  const [showOpts, setShowOpts] = useState<boolean>(false);
  const [val, setVal] = useState(selectValue());

  function selectValue() {
    if (typeof value === "string" || typeof value === "number") return value;
    let val: any = "";
    React.Children.forEach(children, (child: any, index) => {
      if (index === 0) val = child.props.value;
    });
    return val;
  }

  /*eslint-disable*/
  useEffect(() => {
    setVal(selectValue());
  }, [value]);
  /*eslint-enable*/

  return (
    <div
      className={`${styles.Cstm} ${styles.MultipleSelectr} disable-focus-outline`}
      onBlur={() => setShowOpts(false)}
      onFocusCapture={() => setShowOpts(true)}
      tabIndex={0}
      ref={selectr}
      id={name}
    >
      <div>{label}</div>
      <div className={styles.SelectBox} tabIndex={-1}>
        <div className={styles.ChosenBox} tabIndex={-1}>
          <span className={styles.Chosen}>{val}</span>
        </div>
        <div
          className={`${styles.OptionBox} ${showOpts ? styles.Active : ""}`}
          tabIndex={-1}
        >
          {React.Children.map(children, (child: any) => (
            <MultipleOption
              value={child.props.value}
              selected={val === child.props.value}
              toggleSelection={onChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const LinearSelectr: React.FC<selectr> = ({
  label,
  name,
  value,
  children,
  onChange = () => {},
}) => {
  const [val, setVal] = useState(selectValue());

  function selectValue() {
    if (typeof value === "string" || typeof value === "number") return value;
    let val: any = "";
    React.Children.forEach(children, (child: any, index) => {
      if (index === 0) val = child.props.value;
    });
    return val;
  }

  /*eslint-disable*/
  useEffect(() => {
    setVal(selectValue());
  }, [value]);
  /*eslint-enable*/

  return (
    <div className={`${styles.Cstm} ${styles.LinearSelectr}`} id={name}>
      <div>{label}</div>
      <div className={styles.SelectBox}>
        {React.Children.map(children, (child: any) => (
          <LinearOption
            value={child.props.value}
            selected={val === child.props.value}
            toggleSelection={onChange}
          />
        ))}
      </div>
    </div>
  );
};

const MultipleSelectr: React.FC<multiSelectr> = ({
  label,
  name,
  value = [],
  onChange = () => {},
  children,
}) => {
  const selectr = useRef<HTMLDivElement>(null);
  const [showOpts, setShowOpts] = useState<boolean>(false);
  const [numOfOptions, setNumOfOptions] = useState<number>(0);
  const [vals, setVals] = useState(value);

  useEffect(() => {
    setVals(value);
  }, [value]);

  useEffect(() => {
    /* ---code xcxc- for determining the number of options with unique values */
    const arr: any[] = [];
    React.Children.forEach(children, (child: any) => {
      if (!arr.includes(child?.props.value)) arr.push(child?.props.value);
    });
    setNumOfOptions(arr.length);
    return () => setNumOfOptions(0);
    /* --end of code xcxc */
  }, [children]);

  return (
    <div
      className={`${styles.Cstm} ${styles.MultipleSelectr}`}
      onBlur={() => setShowOpts(false)}
      onFocusCapture={() => setShowOpts(true)}
      tabIndex={-1}
      ref={selectr}
    >
      <div>{label}</div>
      <div className={styles.SelectBox} tabIndex={-1}>
        <div className={styles.ChosenBox} tabIndex={-1}>
          {/* --the code below renders elements to the chosenbox based on the num of selected options*/}
          {vals.length === 0 ? (
            <span className={styles.Chosen} style={{ cursor: "pointer" }}>
              Unspecified
            </span>
          ) : vals.length === numOfOptions ? (
            <span className={styles.Chosen}>All</span>
          ) : (
            vals.map((val) => (
              <span key={val} className={styles.Chosen}>
                <span>{val}</span>
                <button
                  className={styles.RemoveButton}
                  onClick={() => {
                    onChange(val);
                    selectr.current?.focus();
                  }}
                  type="button"
                >
                  <CloseIcon />
                </button>
              </span>
            ))
          )}
        </div>
        <div
          className={`${styles.OptionBox} ${showOpts ? styles.Active : ""}`}
          tabIndex={-1}
        >
          {React.Children.map(children, (child: any) => (
            <MultipleOption
              value={child.props.value}
              selected={vals.includes(child.props.value)}
              toggleSelection={onChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const LinearMultipleSelectr: React.FC<multiSelectr> = ({
  label,
  name,
  value = [],
  onChange = () => {},
  children,
}) => {
  const [vals, setVals] = useState(value);

  useEffect(() => {
    setVals(value);
  }, [value]);

  return (
    <div className={`${styles.Cstm} ${styles.LinearSelectr}`}>
      <div>{label}</div>
      <div className={styles.SelectBox}>
        {React.Children.map(children, (child: any) => (
          <LinearOption
            value={child.props.value}
            selected={vals.includes(child.props.value)}
            toggleSelection={onChange}
          />
        ))}
      </div>
    </div>
  );
};

const MultipleOption: React.FC<pOption> = ({
  value,
  selected,
  toggleSelection,
}) => {
  return (
    <button
      className={`${styles.MultipleOption} ${selected ? styles.Selected : ""}`}
      onClick={() => toggleSelection(value)}
      type="button"
    >
      {value}
    </button>
  );
};

const LinearOption: React.FC<pOption> = ({
  value,
  selected,
  toggleSelection,
}) => {
  return (
    <button
      className={`${styles.Option} ${selected ? styles.Selected : ""}`}
      onClick={() => toggleSelection(value)}
      type="button"
    >
      {value}
    </button>
  );
};
