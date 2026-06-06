import { useState } from "react";

// Sant/Falskt-fråga. question.answer är true eller false.
export default function TrueFalse({ question, locked, onAnswered }) {
  const [chosen, setChosen] = useState(null);

  function pick(val) {
    if (locked) return;
    setChosen(val);
    onAnswered(val === question.answer);
  }

  const opts = [
    { val: true, label: "✅ Sant" },
    { val: false, label: "❌ Falskt" },
  ];

  return (
    <div className="tf-row">
      {opts.map((o) => {
        let cls = "option";
        if (locked) {
          if (o.val === question.answer) cls += " correct";
          else if (o.val === chosen) cls += " wrong";
        }
        return (
          <button key={String(o.val)} className={cls} disabled={locked} onClick={() => pick(o.val)}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
