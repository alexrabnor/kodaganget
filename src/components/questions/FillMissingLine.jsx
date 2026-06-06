import { useState } from "react";

// Kod som saknar en rad. question.code innehåller markören "___" där raden saknas.
// question.options = kandidatrader, question.answer = index på rätt rad.
export default function FillMissingLine({ question, locked, onAnswered }) {
  const [chosen, setChosen] = useState(null);

  function pick(i) {
    if (locked) return;
    setChosen(i);
    onAnswered(i === question.answer);
  }

  const filled = chosen != null ? question.options[chosen] : "▢ ▢ ▢";
  const codeParts = question.code.split("___");

  return (
    <>
      <pre className="code-block">
        {codeParts[0]}
        <span className="blank">{filled}</span>
        {codeParts[1]}
      </pre>
      <div className="options">
        {question.options.map((opt, i) => {
          let cls = "option";
          if (locked) {
            if (i === question.answer) cls += " correct";
            else if (i === chosen) cls += " wrong";
          }
          return (
            <button key={i} className={cls} disabled={locked} onClick={() => pick(i)}>
              <code>{opt}</code>
            </button>
          );
        })}
      </div>
    </>
  );
}
