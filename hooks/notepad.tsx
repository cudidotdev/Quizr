import React, { useEffect, useState } from "react";
import styles from "styles/components/notepad.module.css";
import type { note, _note } from "types/components/notepad";

export default function useNotePad(): [React.FC, (note: note) => void] {
  const [notes, setNotes] = useState<_note[]>([]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setTimeout(() => setFade(false), 500);
  }, [notes]);

  function addNote(note: note) {
    if (notes.some((_note) => _note.id === note.id)) return;
    setNotes((prev) => {
      return [
        ...prev.filter((note) => {
          delete note._new;
          return note;
        }),
        { ...note, _new: true },
      ];
    });
    setFade(true);
    setTimeout(() => removeNote(note.id), 5000);
  }

  function removeNote(id: string) {
    setNotes((prev) =>
      prev.filter((note) => {
        delete note._new;
        return note.id !== id;
      })
    );
  }

  const Note: React.FC<_note> = ({ msg, type, _new }) => (
    <div
      className={`${styles.Note} ${type === "error" ? styles.Error : ""} ${
        type === "success" ? styles.Success : ""
      } ${_new === true && fade ? styles.New : ""} `}
    >
      <span className={`${styles.Icon} t-medium`}>
        {type === "error" ? "!" : "\u2713"}
      </span>
      <span className={styles.Text}>{msg}</span>
    </div>
  );

  const NotePad: React.FC = () => {
    return (
      <div className={`${styles.NotePad}`}>
        {notes.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            msg={note.msg}
            type={note.type}
            _new={note._new}
          />
        ))}
      </div>
    );
  };

  return [NotePad, addNote];
}
