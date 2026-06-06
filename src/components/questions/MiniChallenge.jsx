import { useState } from "react";

// Miniutmaning: skriv svaret själv. question.accept = lista med godkända svar.
// question.code visas valfritt som kontext.
export default function MiniChallenge({ question, locked, onAnswered }) {
  const [value, setValue] = useState("");

  function norm(s) {
    return s.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function submit() {
    if (locked || !value.trim()) return;
    const ok = question.accept.some((a) => norm(a) === norm(value));
    onAnswered(ok);
  }

  return (
    <>
      {question.code && <pre className="code-block">{question.code}</pre>}
      <input
        className="mini-input"
        value={value}
        disabled={locked}
        placeholder="Skriv ditt svar..."
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        style={
          locked
            ? { borderColor: question.accept.some((a) => norm(a) === norm(value)) ? "var(--good)" : "var(--bad)" }
            : undefined
        }
      />
      {!locked && (
        <button className="btn" style={{ marginTop: "0.8rem" }} disabled={!value.trim()} onClick={submit}>
          Svara
        </button>
      )}
      {locked && (
        <p className="quip" style={{ marginTop: "0.6rem" }}>Godkänt svar: {question.accept[0]}</p>
      )}
    </>
  );
}
