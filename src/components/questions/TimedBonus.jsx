import { useEffect, useRef, useState } from "react";

// Tidsbegränsad bonusfråga. Flerval med nedräkning – hinner du inte = fel.
export default function TimedBonus({ question, locked, onAnswered }) {
  const total = question.time || 15;
  const [left, setLeft] = useState(total);
  const [chosen, setChosen] = useState(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (locked) return;
    if (left <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        onAnswered(false); // tiden tog slut
      }
      return;
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, locked, onAnswered]);

  function pick(i) {
    if (locked || firedRef.current) return;
    firedRef.current = true;
    setChosen(i);
    onAnswered(i === question.answer);
  }

  return (
    <>
      <div className="timer-bar">
        <div className="timer-fill" style={{ width: `${(left / total) * 100}%` }} />
      </div>
      <p style={{ textAlign: "center", marginBottom: "0.6rem", fontWeight: 700 }}>
        ⏱ {locked ? "Tiden ute" : `${left}s kvar`}
      </p>
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
