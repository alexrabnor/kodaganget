import { useEffect } from "react";
import { useGame } from "../state/GameContext.jsx";

// Visar tillfälliga aviseringar (achievements, easter eggs, info).
export default function ToastStack() {
  const { state } = useGame();
  return (
    <div className="toast-stack">
      {state.toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}

function Toast({ toast }) {
  const { actions } = useGame();
  useEffect(() => {
    const ms = toast.kind === "achievement" ? 4000 : 2800;
    const timer = setTimeout(() => actions.dismissToast(toast.id), ms);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`toast ${toast.kind}`} onClick={() => actions.dismissToast(toast.id)}>
      {toast.kind === "achievement" && <small>🏆 Achievement upplåst!</small>}
      {toast.text}
    </div>
  );
}
