import { useMemo, useState } from "react";

// Kodpussel: dra kodraderna till rätt ordning.
// question.lines = raderna i KORREKT ordning.
export default function CodePuzzle({ question, locked, onAnswered }) {
  const correct = question.lines;
  const [order, setOrder] = useState(() => shuffleStable(correct));
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  function onDrop(targetIdx) {
    if (dragIdx === null || locked) return;
    const next = [...order];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setOrder(next);
    setDragIdx(null);
    setOverIdx(null);
  }

  function submit() {
    if (locked) return;
    onAnswered(order.every((l, i) => l === correct[i]));
  }

  return (
    <>
      <div className="code-list">
        {order.map((line, i) => (
          <div
            key={line}
            className={`code-line ${dragIdx === i ? "dragging" : ""} ${overIdx === i ? "over" : ""}`}
            draggable={!locked}
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }}
            onDrop={() => onDrop(i)}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            style={
              locked
                ? { borderColor: line === correct[i] ? "var(--good)" : "var(--bad)" }
                : undefined
            }
          >
            <span className="grip">⠿</span>
            <code>{line}</code>
          </div>
        ))}
      </div>
      {!locked && (
        <button className="btn" style={{ marginTop: "1rem" }} onClick={submit}>
          Kör koden ▶
        </button>
      )}
    </>
  );
}

// Blandar men garanterar att ordningen inte råkar bli den korrekta.
function shuffleStable(arr) {
  if (arr.length < 2) return [...arr];
  let out;
  do {
    out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
  } while (out.every((l, i) => l === arr[i]));
  return out;
}
