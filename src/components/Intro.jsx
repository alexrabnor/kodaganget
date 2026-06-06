import { useGame } from "../state/GameContext.jsx";
import { hasSave } from "../state/storage.js";

// Startskärm – utanför Solhem.
export default function Intro() {
  const { actions, state } = useGame();
  const saveExists = hasSave() && state.unlockedOrder > 1;

  return (
    <div className="screen intro">
      <div className="stars-bg" />
      <div className="center-col">
        <div className="intro-house" aria-hidden>🏠</div>
        <h1>Solhem Escape</h1>
        <p className="tagline">
          Du har blivit inlåst i <strong>Solhem</strong> under kodadagen. Det finns bara
          ett sätt att ta sig till dagens höjdpunkt – <strong>bastun</strong>. För att lyckas
          måste du besegra varje rum med dina kunskaper inom kod, teknik och dagens
          föreläsningar. Varje avklarat rum låser upp nästa. Klarar du allt väntar
          bastu och en kall öl. 🍺
        </p>
        <div className="center-col" style={{ marginTop: "0.6rem" }}>
          {saveExists && (
            <button className="btn big" onClick={actions.continueGame}>
              ▶ Fortsätt
            </button>
          )}
          <button
            className={saveExists ? "btn ghost" : "btn big"}
            onClick={() => {
              if (!saveExists || confirm("Börja om från början? Din nuvarande framgång raderas.")) {
                actions.startNew();
              }
            }}
          >
            {saveExists ? "↺ Börja om" : "🚪 Gå in i Solhem"}
          </button>
        </div>
      </div>
    </div>
  );
}
