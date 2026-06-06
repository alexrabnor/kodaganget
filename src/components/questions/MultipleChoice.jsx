import { useState } from "react";

// Flervalsfråga. Klick på ett alternativ låser frågan och rapporterar resultat.
export default function MultipleChoice({ question, locked, onAnswered }) {
  const [chosen, setChosen] = useState(null);

  function pick(i) {
    if (locked) return;
    setChosen(i);
    onAnswered(i === question.answer);
  }

  return (
    <div className="options">
      {question.options.map((opt, i) => {
        let cls = "option";
        if (locked) {
          if (i === question.answer) cls += " correct";
          else if (i === chosen) cls += " wrong";
        }
        return (
          <button key={i} className={cls} disabled={locked} onClick={() => pick(i)}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}
