import { useGame } from "../state/GameContext.jsx";
import { ROOM_COUNT } from "../data/rooms.js";

// Statusrad med XP, poäng, stjärnor och rum-progress.
export default function HUD() {
  const { state } = useGame();
  const cleared = Object.keys(state.completed).length;

  return (
    <div className="hud">
      <span className="stat"><span className="ico">⭐</span>{state.totalStars}</span>
      <span className="stat"><span className="ico">✨</span>{state.xp} XP</span>
      <span className="stat"><span className="ico">🎯</span>{state.score} p</span>
      <span className="stat"><span className="ico">🔥</span>{state.streak} i rad</span>
      <span className="stat"><span className="ico">🏆</span>{state.achievements.length}</span>
      <span className="stat"><span className="ico">🚪</span>{cleared}/{ROOM_COUNT}</span>
    </div>
  );
}
