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

const MultipleSelectr: React.FC<multiSelectr> = ({
  label,
  name,
  value = [],
  onChange = () => {},
  children,
}) => {
  const selectr = useRef<HTMLDivElement>(null);
  const [showOpts, setShowOpts] = useState<boolean>(false);
  const [selected, setSelected] = useState<Array<string | number>>(value);
  const [numOfOptions, setNumOfOptions] = useState<number>(0);

  function toggleSelection(value: string | number) {
    setSelected((prev) => {
      //adds to selected
      if (!prev.includes(value)) return [...prev, value];
      //removes from selected
      else {
        const prevCopy = prev.slice(); //shallow copy the previous state
        prevCopy.splice(
          prev.findIndex((val) => val === value),
          1
        );
        return prevCopy;
      }
    });
  }

  useEffect(() => {
    /* ---code xcxc- for determining the number of options with unique values */
    const arr: any[] = [];
    React.Children.forEach(children, (child) => {
      //@ts-ignore
      if (!arr.includes(child?.props.value)) arr.push(child?.props.value);
    });
    setNumOfOptions(arr.length);
    return () => setNumOfOptions(0);
    /* --end of code xcxc */
  }, [children]);

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  return (
    <div
      className={`${styles.Cstm} ${styles.MultipleSelectr}`}
      onBlur={() => setShowOpts(false)}
      onFocusCapture={() => setShowOpts(true)}
      tabIndex={-1}
      ref={selectr}
    >
      <div>{label}:</div>
      <div className={styles.SelectBox} tabIndex={-1}>
        <div className={styles.ChosenBox} tabIndex={-1}>
          {/* --the code below renders elements to the chosenbox based on the num of selected options*/}
          {selected.length === 0 ? (
            <span className={styles.Chosen} style={{ cursor: "pointer" }}>
              None
            </span>
          ) : selected.length === numOfOptions ? (
            <span className={styles.Chosen}>All</span>
          ) : (
            selected.map((val) => (
              <span key={val} className={styles.Chosen}>
                <span>{val}</span>
                <button
                  className={styles.RemoveButton}
                  onClick={() => {
                    toggleSelection(val);
                    selectr.current?.focus();
                  }}
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
          {React.Children.map(children, (child) => (
            <MultipleOption
              //@ts-ignore
              value={child.props.value}
              //@ts-ignore
              selected={selected.includes(child.props.value)}
              toggleSelection={toggleSelection}
            />
          ))}
        </div>
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
    >
      {value}
    </button>
  );
};

const LinearSelectr: React.FC<selectr> = ({
  label,
  name,
  value,
  children,
  onChange = () => {},
}) => {
  const [selected, setSelected] = useState<string | number>(defaultValue());

  function defaultValue() {
    if (typeof value === "string" || typeof value === "number") return value;
    let val: any = "";
    React.Children.forEach(children, (child, index) => {
      //@ts-ignore
      if (index === 0) val = child.props.value;
    });
    return val;
  }

  function changeSelection(value: string | number) {
    setSelected(value);
  }

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  return (
    <div className={`${styles.Cstm} ${styles.LinearSelectr}`}>
      <div>{label}:</div>
      <div className={styles.SelectBox}>
        {React.Children.map(children, (child) => (
          <LinearOption
            //@ts-ignore
            value={child.props.value}
            //@ts-ignore
            selected={selected === child.props.value}
            toggleSelection={changeSelection}
          />
        ))}
      </div>
    </div>
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
    >
      {value}
    </button>
  );
};

const LinearMultipleSelectr: React.FC<multiSelectr> = ({
  label,
  name,
  value = [],
  onChange = () => {},
  children,
}) => {
  const [selected, setSelected] = useState<Array<string | number>>(value);

  function toggleSelection(value: string | number) {
    setSelected((prev) => {
      //adds to selected
      if (!prev.includes(value)) return [...prev, value];
      //removes from selected
      else {
        const prevCopy = prev.slice(); //shallow copy the previous state
        prevCopy.splice(
          prev.findIndex((val) => val === value),
          1
        );
        return prevCopy;
      }
    });
  }

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  return (
    <div className={`${styles.Cstm} ${styles.LinearSelectr}`}>
      <div>{label}:</div>
      <div className={styles.SelectBox}>
        {React.Children.map(children, (child) => (
          <LinearOption
            //@ts-ignore
            value={child.props.value}
            //@ts-ignore
            selected={selected.includes(child.props.value)}
            toggleSelection={toggleSelection}
          />
        ))}
      </div>
    </div>
  );
};

const DefaultSelectr: React.FC<selectr> = ({
  children,
  label,
  value,
  name,
  onChange = () => {},
}) => {
  const selectr = useRef<HTMLDivElement>(null);
  const [showOpts, setShowOpts] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | number>(defaultValue());

  function changeSelection(value: string | number) {
    setSelected(value);
  }

  function defaultValue() {
    if (typeof value === "string" || typeof value === "number") return value;
    let val: any = "";
    React.Children.forEach(children, (child, index) => {
      //@ts-ignore
      if (index === 0) val = child.props.value;
    });
    return val;
  }

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  return (
    <div
      className={`${styles.Cstm} ${styles.MultipleSelectr}`}
      onBlur={() => setShowOpts(false)}
      onFocusCapture={() => setShowOpts(true)}
      tabIndex={-1}
      ref={selectr}
    >
      <div>{label}:</div>
      <div className={styles.SelectBox} tabIndex={-1}>
        <div className={styles.ChosenBox} tabIndex={-1}>
          {!!selected ? (
            <span className={styles.Chosen}>{selected}</span>
          ) : (
            <span className={styles.Chosen}>Choose</span>
          )}
        </div>
        <div
          className={`${styles.OptionBox} ${showOpts ? styles.Active : ""}`}
          tabIndex={-1}
        >
          {React.Children.map(children, (child) => (
            <MultipleOption
              //@ts-ignore
              value={child.props.value}
              //@ts-ignore
              selected={selected === child.props.value}
              toggleSelection={changeSelection}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
