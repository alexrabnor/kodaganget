import { useEffect } from "react";
import { useGame } from "../state/GameContext.jsx";
import { ROOM_COUNT } from "../data/rooms.js";
import { AudioManager } from "../audio/AudioManager.js";
import Confetti from "./effects/Confetti.jsx";
import Fireworks from "./effects/Fireworks.jsx";

// Slutscenen: bastun. Alla rum klara → ånga, kall öl, konfetti och fyrverkerier.
export default function EndScene() {
  const { state, actions } = useGame();

  useEffect(() => {
    AudioManager.playSfx("win");
    AudioManager.stopMusic();
  }, []);

  return (
    <div className="screen end-screen">
      <Fireworks />
      <Confetti />

      <div className="end-emojis">🔥🧖‍♂️💨</div>
      <h1>🎉 Grattis! Du klarade Solhem Escape!</h1>
      <h2>Nu väntar bastu, öl och välförtjänt skryt!</h2>

      <div className="sauna">
        <span className="steam" style={{ left: "25%", animationDelay: "0s" }} />
        <span className="steam" style={{ left: "50%", animationDelay: "1.3s" }} />
        <span className="steam" style={{ left: "70%", animationDelay: "2.1s" }} />
        <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
          Dörrarna öppnas. Du kliar dig ner i den varma bastun på Solhem. Träpanelen
          knakar, ångan stiger och på bänken står en iskall öl och väntar precis på dig.
        </p>
        <div className="beer" aria-hidden>🍺</div>
      </div>

      <div className="end-stats">
        <div className="es"><span className="n">{state.totalStars}</span>⭐ stjärnor</div>
        <div className="es"><span className="n">{state.xp}</span>✨ XP</div>
        <div className="es"><span className="n">{state.score}</span>🎯 poäng</div>
        <div className="es"><span className="n">{state.achievements.length}</span>🏆 troféer</div>
        <div className="es"><span className="n">{state.bestStreak}</span>🔥 bästa combo</div>
        <div className="es"><span className="n">{ROOM_COUNT}</span>🚪 rum klara</div>
      </div>

      <div className="center-col">
        <button className="btn big" onClick={actions.goHouse}>🏠 Tillbaka till Solhem</button>
        <button
          className="btn ghost"
          onClick={() => {
            if (confirm("Spela hela äventyret igen från början?")) actions.startNew();
          }}
        >
          ↺ Spela igen
        </button>
      </div>
    </div>
  );
}
