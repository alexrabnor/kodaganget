import { useEffect, useRef } from "react";
import { useGame } from "../state/GameContext.jsx";
import { EGG_MESSAGES } from "../data/easterEggs.js";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

// Lyssnar globalt efter Konami-koden (dold hemlighet).
export default function KonamiListener() {
  const { actions, state } = useGame();
  const buffer = useRef([]);

  useEffect(() => {
    function onKey(e) {
      buffer.current = [...buffer.current, e.key].slice(-KONAMI.length);
      if (KONAMI.every((k, i) => k.toLowerCase() === (buffer.current[i] || "").toLowerCase())) {
        if (!state.achievements.includes("konami")) {
          actions.toast(EGG_MESSAGES.konami, "egg");
          actions.unlockAch("konami");
        }
        buffer.current = [];
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actions, state.achievements]);

  return null;
}
