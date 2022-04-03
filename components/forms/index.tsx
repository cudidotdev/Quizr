import {
  EyeOpenIcon,
  EyeClosedIcon,
  SearchIcon,
  AddIcon,
} from "components/icons";
import React, { useEffect, useRef, useState } from "react";
import styles from "styles/components/forms.module.css";
import type { inputr, searchr, selectr } from "types/components/form";

export const Inputr: React.FC<inputr> = ({
  label,
  name,
  value,
  setValue,
  type = "text",
  Icon,
  clickFn,
  passProps = {},
}) => {
  const cstm = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles.Cstm}`} ref={cstm}>
      <label htmlFor={name}>{label}:</label>
      <div className={`${styles.InputBox}`}>
        <input
          autoComplete="off"
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={(ev: any) => setValue && setValue(ev.target.value)}
          onFocus={() => cstm.current?.classList.add(styles.Color)}
          onBlur={() => cstm.current?.classList.remove(styles.Color)}
          {...passProps}
        />
        {!!Icon && (
          <button
            className={`${styles.IconBox} disable-focus-outline`}
            onClick={() => clickFn && clickFn()}
          >
            <Icon />
          </button>
        )}
      </div>
    </div>
  );
};

export const Searchr: React.FC<searchr> = ({
  label = "Search",
  name,
  value,
  setValue,
  clickFn,
  passProps = {},
}) => (
  <Inputr
    label={label}
    name={name}
    value={value}
    setValue={setValue}
    Icon={SearchIcon}
    clickFn={clickFn}
    passProps={{
      ...passProps,
      onKeyDown: (ev: any) => ev.key === "Enter" && clickFn && clickFn(),
    }}
  />
);

export const Passwordr: React.FC<searchr> = ({
  label = "Password",
  name,
  value,
  setValue,
  passProps = {},
  clickFn = () => {},
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  function _clickFn() {
    clickFn();
    setVisible((visibility) => !visibility);
  }

  return (
    <Inputr
      label={label}
      name={name}
      value={value}
      setValue={setValue}
      Icon={visible ? EyeClosedIcon : EyeOpenIcon}
      clickFn={_clickFn}
      passProps={passProps}
    />
  );
};

export const Selectr: React.FC<selectr> = ({
  label,
  name,
  multiple,
  onChange = () => {},
}) => {
  if (multiple)
    return <MultipleSelectr label={label} name={name} onChange={onChange} />;
  return <></>;
};

export const MultipleSelectr: React.FC<selectr> = ({
  label,
  name,
  onChange = () => {},
  children,
}) => {
  const [showOpts, setShowOpts] = useState<boolean>(false);
  return (
    <div className={`${styles.Cstm} ${styles.Selectr}`}>
      <div>{label}:</div>
      <div className={styles.SelectBox}>
        <div>
          <button
            className={`${styles.AddButton} disable-focus-outline`}
            onClick={() => setShowOpts((prev) => !prev)}
          >
            <AddIcon />
          </button>
        </div>
        <div className={`${styles.OptionBox} ${showOpts ? styles.Active : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Option: React.FC = () => <></>;
