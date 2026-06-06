import { useMemo, useState } from "react";

// Dra och släpp: placera varje begrepp (chip) i rätt hink (bin).
// question.bins = [{ id, label }], question.items = [{ text, bin }].
export default function DragDrop({ question, locked, onAnswered }) {
  const initialPool = useMemo(() => shuffle(question.items.map((i) => i.text)), [question]);
  const [pool, setPool] = useState(initialPool);
  const [placed, setPlaced] = useState({}); // text -> binId
  const [dragText, setDragText] = useState(null);
  const [overBin, setOverBin] = useState(null);

  const correctBin = useMemo(
    () => Object.fromEntries(question.items.map((i) => [i.text, i.bin])),
    [question]
  );
  const allPlaced = pool.length === 0;

  function dropInBin(binId) {
    if (!dragText || locked) return;
    setPlaced((p) => ({ ...p, [dragText]: binId }));
    setPool((p) => p.filter((t) => t !== dragText));
    setDragText(null);
    setOverBin(null);
  }

  function dropInPool() {
    if (!dragText || locked) return;
    if (placed[dragText]) {
      setPlaced((p) => {
        const c = { ...p };
        delete c[dragText];
        return c;
      });
      setPool((p) => [...p, dragText]);
    }
    setDragText(null);
  }

  function submit() {
    if (locked || !allPlaced) return;
    onAnswered(Object.entries(placed).every(([text, bin]) => correctBin[text] === bin));
  }

  return (
    <div className="dragdrop">
      <div
        className="drag-pool"
        onDragOver={(e) => e.preventDefault()}
        onDrop={dropInPool}
      >
        {pool.map((t) => (
          <span
            key={t}
            className="chip"
            draggable={!locked}
            onDragStart={() => setDragText(t)}
          >
            {t}
          </span>
        ))}
        {pool.length === 0 && <span style={{ opacity: 0.5 }}>Alla placerade ✔</span>}
      </div>

      <div className="bins">
        {question.bins.map((bin) => (
          <div
            key={bin.id}
            className={`bin ${overBin === bin.id ? "over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setOverBin(bin.id); }}
            onDragLeave={() => setOverBin(null)}
            onDrop={() => dropInBin(bin.id)}
          >
            <h4>{bin.label}</h4>
            <div className="chips">
              {Object.entries(placed)
                .filter(([, b]) => b === bin.id)
                .map(([t]) => {
                  const ok = correctBin[t] === bin.id;
                  return (
                    <span
                      key={t}
                      className="chip"
                      draggable={!locked}
                      onDragStart={() => setDragText(t)}
                      style={locked ? { background: ok ? "var(--good)" : "var(--bad)" } : undefined}
                    >
                      {t}
                    </span>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {!locked && (
        <button className="btn" disabled={!allPlaced} onClick={submit}>
          Kontrollera
        </button>
      )}
    </div>
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
