import { useCallback, useEffect, useState } from "react";
import { useGame } from "../state/GameContext.jsx";
import { getRoomById } from "../data/rooms.js";
import { ROOM_ACHIEVEMENT } from "../data/achievements.js";
import { GENERIC_CORRECT, GENERIC_WRONG, randomFrom } from "../data/easterEggs.js";
import { AudioManager } from "../audio/AudioManager.js";
import QuestionRenderer, { typeLabel } from "./questions/QuestionRenderer.jsx";
import HUD from "./HUD.jsx";

export default function Room() {
  const { state, actions } = useGame();
  const room = getRoomById(state.currentRoomId);

  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  // Byt musik till rummets tema (no-op tills ljudfiler lagts till).
  useEffect(() => {
    if (room) AudioManager.playMusic(room.theme.music);
    return () => AudioManager.stopMusic();
  }, [room]);

  const handleAnswered = useCallback(
    (correct) => {
      setLocked((isLocked) => {
        if (isLocked) return isLocked; // svara bara en gång
        setLastCorrect(correct);
        if (correct) setCorrectCount((c) => c + 1);
        actions.answer(correct);
        AudioManager.playSfx(correct ? "correct" : "wrong");
        return true;
      });
    },
    [actions]
  );

  if (!room) {
    return (
      <div className="screen room-screen">
        <p style={{ margin: "2rem" }}>Rummet kunde inte hittas.</p>
        <button className="btn" onClick={actions.goHouse}>Tillbaka</button>
      </div>
    );
  }

  const questions = room.questions;
  const total = questions.length;
  const q = questions[index];
  const themeStyle = { "--room-color": room.theme.color, "--room-accent": room.theme.accent };

  function next() {
    if (index + 1 >= total) {
      // Rummet klart.
      actions.completeRoom({
        roomId: room.id,
        correct: correctCount,
        total,
        order: room.order,
        achievement: ROOM_ACHIEVEMENT[room.id],
      });
      AudioManager.playSfx("unlock");
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setLocked(false);
    }
  }

  if (finished) {
    const ratio = total ? correctCount / total : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
    return (
      <div className="screen room-screen" style={themeStyle}>
        <HUD />
        <div className="room-clear">
          <div className="room-icon" style={{ fontSize: "3.4rem" }}>{room.theme.icon}</div>
          <h2 style={{ color: "#fff" }}>Rum klart!</h2>
          <p className="big-stars">{"★".repeat(stars)}{"☆".repeat(3 - stars)}</p>
          <p style={{ margin: "0.6rem 0 1.2rem" }}>
            Du fick {correctCount} av {total} rätt.
            {correctCount === total ? " Felfritt! 🐞❌" : ""}
          </p>
          <button className="btn big" onClick={actions.goHouse}>🏠 Tillbaka till Solhem</button>
        </div>
      </div>
    );
  }

  const quip = lastCorrect
    ? q.quip || randomFrom(GENERIC_CORRECT)
    : q.quipWrong || randomFrom(GENERIC_WRONG);

  return (
    <div className="screen room-screen" style={themeStyle}>
      <HUD />
      <button className="btn ghost back-btn" onClick={actions.goHouse}>⟵ Huset</button>

      <div className="room-header">
        <div className="room-icon">{room.theme.icon}</div>
        <h2>{room.title}</h2>
        <p className="room-atmos">{room.theme.atmosphere}</p>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <div className="question-card" key={q.id}>
        <span className="question-type-tag">
          {typeLabel(q.type)} · Fråga {index + 1}/{total}
          {(q.type === "timed-bonus" || q.timed) && <span className="bonus-badge">BONUS</span>}
        </span>
        <p className="question-prompt">{q.prompt}</p>

        <QuestionRenderer question={q} locked={locked} onAnswered={handleAnswered} />

        {locked && (
          <div className={`feedback ${lastCorrect ? "good" : "bad"}`}>
            <div className="verdict">{lastCorrect ? "✅ Rätt!" : "❌ Fel!"}</div>
            {q.explanation && <div className="explain">{q.explanation}</div>}
            <div className="quip">{quip}</div>
          </div>
        )}
      </div>

      {locked && (
        <div className="room-actions">
          <span />
          <button className="btn" onClick={next}>
            {index + 1 >= total ? "Avsluta rummet ✔" : "Nästa fråga →"}
          </button>
        </div>
      )}
    </div>
  );
}
