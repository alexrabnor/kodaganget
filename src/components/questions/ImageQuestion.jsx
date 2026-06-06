import { useState } from "react";

// Bildfråga: visar en bild (eller stor emoji) + flervalsalternativ.
// question.image kan vara en URL/path eller en emoji-sträng.
export default function ImageQuestion({ question, locked, onAnswered }) {
  const [chosen, setChosen] = useState(null);
  const isUrl = /^(https?:|\/|data:)/.test(question.image || "");

  function pick(i) {
    if (locked) return;
    setChosen(i);
    onAnswered(i === question.answer);
  }

  return (
    <>
      <div className="image-frame">
        {isUrl ? <img src={question.image} alt={question.alt || "bild"} /> : <span>{question.image}</span>}
      </div>
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
    </>
  );
}
