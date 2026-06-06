import { useRef } from "react";
import { useGame } from "../state/GameContext.jsx";
import { ROOMS, ROOM_COUNT } from "../data/rooms.js";
import { ACHIEVEMENTS } from "../data/achievements.js";
import { EGG_MESSAGES } from "../data/easterEggs.js";
import HUD from "./HUD.jsx";

// Huvudkartan: gula huset Solhem med en dörr per rum + bastudörren.
export default function HouseMap() {
  const { state, actions } = useGame();
  const doorClicks = useRef({}); // räknar klick per låst dörr (easter egg)
  const allCleared = Object.keys(state.completed).length >= ROOM_COUNT;

  function handleDoor(room) {
    const locked = room.order > state.unlockedOrder;
    if (!locked) {
      actions.openRoom(room.id);
      return;
    }
    // Låst dörr – räkna spam-klick.
    const n = (doorClicks.current[room.id] || 0) + 1;
    doorClicks.current[room.id] = n;
    if (n === 20) {
      actions.toast(EGG_MESSAGES.doorSpam, "egg");
      actions.unlockAch("stubborn-door");
    } else {
      actions.toast("🔒 Klara rummet före för att låsa upp.", "info");
    }
  }

  function handleSauna() {
    if (allCleared) {
      actions.goEnd();
    } else {
      // Klickar på ölen/bastun innan upplåst.
      actions.toast(EGG_MESSAGES.beerEarly, "egg");
      actions.unlockAch("beer-tease");
    }
  }

  return (
    <div className="screen house-screen">
      <HUD />
      <h1 className="house-title">🏠 Solhem</h1>
      <p className="house-sub">
        Välj ett upplåst rum. Klara det för att öppna nästa dörr – ända fram till bastun.
      </p>

      <div className="house">
        <div className="doors">
          {ROOMS.map((room) => {
            const locked = room.order > state.unlockedOrder;
            const done = Boolean(state.completed[room.id]);
            const stars = state.completed[room.id]?.stars || 0;
            return (
              <button
                key={room.id}
                className={`door ${locked ? "locked" : "open"} ${done ? "done" : ""}`}
                style={{ "--door-color": room.theme.color }}
                onClick={() => handleDoor(room)}
                title={room.theme.atmosphere}
              >
                <span className="door-num">{room.order}</span>
                <span className="door-icon">{room.theme.icon}</span>
                <span className="door-name">{room.title}</span>
                {done && <span className="door-stars">{"★".repeat(stars)}{"☆".repeat(3 - stars)}</span>}
                {locked && <span className="door-lock">🔒</span>}
              </button>
            );
          })}

          {/* Bastudörren */}
          <button
            className={`door sauna-door ${allCleared ? "open" : "locked"}`}
            onClick={handleSauna}
          >
            <span className="door-icon">{allCleared ? "🧖🍺" : "🔒🍺"}</span>
            <span className="door-name">Bastun</span>
            {!allCleared && <span className="door-lock">🔒</span>}
          </button>
        </div>
      </div>

      <AchievementShelf achievements={state.achievements} />

      <button className="btn ghost" style={{ marginTop: "1.4rem" }} onClick={actions.goIntro}>
        ⟵ Till startskärmen
      </button>
    </div>
  );
}

function AchievementShelf({ achievements }) {
  return (
    <div className="ach-shelf">
      <h3>🏆 Achievements ({achievements.length}/{ACHIEVEMENTS.length})</h3>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = achievements.includes(a.id);
          const showText = unlocked || !a.hidden;
          return (
            <div key={a.id} className={`ach-badge ${unlocked ? "" : "locked"}`}>
              <span>{unlocked ? a.icon : a.hidden ? "❔" : a.icon}</span>
              <span className="tip">
                {showText ? `${a.title} – ${a.desc}` : "Hemlig achievement"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
