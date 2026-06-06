import { useMemo, useState } from "react";

// Matcha rätt begrepp. question.pairs = [{ term, match }].
// Spelaren väljer rätt match för varje term i en dropdown.
export default function Match({ question, locked, onAnswered }) {
  const choices = useMemo(
    () => shuffle(question.pairs.map((p) => p.match)),
    [question]
  );
  const [picks, setPicks] = useState({});

  const allPicked = question.pairs.every((p) => picks[p.term] != null);

  function submit() {
    if (locked || !allPicked) return;
    const correct = question.pairs.every((p) => picks[p.term] === p.match);
    onAnswered(correct);
  }

  return (
    <>
      <div className="match-grid">
        {question.pairs.map((p) => {
          const right = locked && picks[p.term] === p.match;
          const wrong = locked && picks[p.term] !== p.match;
          return (
            <div className="match-row" key={p.term}>
              <div className="match-term">{p.term}</div>
              <select
                className="match-select"
                style={wrong ? { borderColor: "var(--bad)" } : right ? { borderColor: "var(--good)" } : undefined}
                value={picks[p.term] || ""}
                disabled={locked}
                onChange={(e) => setPicks({ ...picks, [p.term]: e.target.value })}
              >
                <option value="" disabled>Välj...</option>
                {choices.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {!locked && (
        <button className="btn" style={{ marginTop: "1rem" }} disabled={!allPicked} onClick={submit}>
          Kontrollera
        </button>
      )}
      {locked && (
        <p className="quip" style={{ marginTop: "0.6rem" }}>
          Rätt: {question.pairs.map((p) => `${p.term} → ${p.match}`).join(" · ")}
        </p>
      )}
    </>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
