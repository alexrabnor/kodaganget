import { useGame } from "./state/GameContext.jsx";
import Intro from "./components/Intro.jsx";
import HouseMap from "./components/HouseMap.jsx";
import Room from "./components/Room.jsx";
import EndScene from "./components/EndScene.jsx";
import ToastStack from "./components/AchievementToast.jsx";
import KonamiListener from "./components/KonamiListener.jsx";

// Enkel vy-router baserad på state.view.
export default function App() {
  const { state } = useGame();

  return (
    <>
      <KonamiListener />
      {state.view === "intro" && <Intro />}
      {state.view === "house" && <HouseMap />}
      {state.view === "room" && <Room />}
      {state.view === "end" && <EndScene />}
      <ToastStack />
    </>
  );
}
