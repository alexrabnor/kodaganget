import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { loadState, saveState, clearState } from "./storage.js";
import { ROOM_COUNT } from "../data/rooms.js";
import { ACHIEVEMENT_MAP } from "../data/achievements.js";
import { EGG_MESSAGES } from "../data/easterEggs.js";

const GameContext = createContext(null);

// Achievements som krävs för "Kodlegend".
const CORE_ACHIEVEMENTS = [
  "first-correct", "five-streak", "bug-hunter", "token-master",
  "unity-wizard", "flutter-hero", "ai-survivor", "perfect-room", "bastumastare",
];

let toastSeq = 0;

const initialState = {
  view: "intro", // intro | house | room | end
  currentRoomId: null,
  unlockedOrder: 1, // högsta upplåsta rummet (order)
  completed: {}, // { roomId: { correct, total, stars, perfect } }
  xp: 0,
  score: 0,
  totalStars: 0,
  streak: 0, // korrekta i rad (globalt)
  bestStreak: 0,
  totalCorrect: 0,
  totalWrong: 0,
  roomWrong: 0, // fel i nuvarande rum (för easter eggs)
  achievements: [],
  flags: {},
  toasts: [], // transient, sparas ej
};

// --- Hjälpare som muterar ett utkast-state ---

function pushToast(draft, text, kind = "info") {
  draft.toasts = [...draft.toasts, { id: ++toastSeq, text, kind }];
}

function unlock(draft, id) {
  if (draft.achievements.includes(id)) return;
  const def = ACHIEVEMENT_MAP[id];
  if (!def) return;
  draft.achievements = [...draft.achievements, id];
  pushToast(draft, `${def.icon} ${def.title}`, "achievement");
  // Kolla om Kodlegend ska låsas upp.
  if (id !== "kodlegend" && CORE_ACHIEVEMENTS.every((a) => draft.achievements.includes(a))) {
    unlock(draft, "kodlegend");
  }
}

function computeStars(correct, total) {
  if (total === 0) return 1;
  const ratio = correct / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  return 1;
}

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      // Återställ framsteg men landa alltid på startsidan (inte där man slutade).
      // "Fortsätt"-knappen tar spelaren vidare till huset.
      return { ...initialState, ...action.payload, view: "intro", currentRoomId: null, toasts: [] };

    case "RESET":
      return { ...initialState };

    case "SET_VIEW": {
      const draft = { ...state, view: action.view };
      if (action.view === "room") {
        draft.currentRoomId = action.roomId;
        draft.roomWrong = 0; // nollställ felräknare för rummet
      }
      if (action.view === "house" || action.view === "intro") {
        draft.currentRoomId = null;
      }
      return draft;
    }

    case "ANSWER": {
      const draft = { ...state };
      if (action.correct) {
        draft.totalCorrect = state.totalCorrect + 1;
        draft.streak = state.streak + 1;
        draft.bestStreak = Math.max(state.bestStreak, draft.streak);
        draft.xp = state.xp + 10;
        draft.score = state.score + 100 + draft.streak * 10; // combo-bonus
        if (state.totalCorrect === 0) unlock(draft, "first-correct");
        if (draft.streak === 5) {
          unlock(draft, "five-streak");
          pushToast(draft, EGG_MESSAGES.streak5, "egg");
        }
      } else {
        draft.totalWrong = state.totalWrong + 1;
        draft.roomWrong = state.roomWrong + 1;
        draft.streak = 0;
        if (draft.roomWrong === 3) pushToast(draft, EGG_MESSAGES.wrong3, "egg");
        if (draft.roomWrong === 5) pushToast(draft, EGG_MESSAGES.wrong5, "egg");
      }
      return draft;
    }

    case "COMPLETE_ROOM": {
      const { roomId, correct, total } = action;
      const draft = { ...state };
      const stars = computeStars(correct, total);
      const perfect = correct === total && total > 0;
      const prev = state.completed[roomId];
      // Behåll bästa resultatet om rummet spelas om.
      const bestStars = prev ? Math.max(prev.stars, stars) : stars;
      draft.completed = {
        ...state.completed,
        [roomId]: { correct, total, stars: bestStars, perfect: perfect || prev?.perfect },
      };
      // Räkna om totala stjärnor.
      draft.totalStars = Object.values(draft.completed).reduce((s, r) => s + r.stars, 0);
      draft.xp = state.xp + 50 + (perfect ? 50 : 0);
      draft.score = state.score + 500 + stars * 100;

      if (perfect) {
        unlock(draft, "perfect-room");
        pushToast(draft, EGG_MESSAGES.perfectRoom, "egg");
      }

      // Lås upp rumsspecifik achievement.
      if (action.achievement) unlock(draft, action.achievement);

      // Lås upp nästa rum.
      if (!prev && action.order >= state.unlockedOrder) {
        draft.unlockedOrder = Math.min(action.order + 1, ROOM_COUNT + 1);
      }

      // Klarat alla rum?
      const allDone = Object.keys(draft.completed).length >= ROOM_COUNT;
      if (allDone) {
        unlock(draft, "bastumastare");
      }
      return draft;
    }

    case "UNLOCK_ACH": {
      const draft = { ...state };
      unlock(draft, action.id);
      return draft;
    }

    case "TOAST": {
      const draft = { ...state };
      pushToast(draft, action.text, action.kind || "info");
      return draft;
    }

    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case "SET_FLAG":
      return { ...state, flags: { ...state.flags, [action.key]: action.value } };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydrated = useRef(false);

  // Ladda sparning en gång vid start.
  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: "HYDRATE", payload: saved });
    hydrated.current = true;
  }, []);

  // Autospar vid varje ändring (men inte transienta toasts).
  useEffect(() => {
    if (!hydrated.current) return;
    const { toasts, ...persisted } = state;
    saveState(persisted);
  }, [state]);

  const actions = {
    startNew: () => {
      clearState();
      dispatch({ type: "RESET" });
      dispatch({ type: "SET_VIEW", view: "house" });
    },
    continueGame: () => dispatch({ type: "SET_VIEW", view: "house" }),
    goHouse: () => dispatch({ type: "SET_VIEW", view: "house" }),
    goIntro: () => dispatch({ type: "SET_VIEW", view: "intro" }),
    openRoom: (roomId) => dispatch({ type: "SET_VIEW", view: "room", roomId }),
    goEnd: () => dispatch({ type: "SET_VIEW", view: "end" }),
    answer: (correct) => dispatch({ type: "ANSWER", correct }),
    completeRoom: (payload) => dispatch({ type: "COMPLETE_ROOM", ...payload }),
    unlockAch: (id) => dispatch({ type: "UNLOCK_ACH", id }),
    toast: (text, kind) => dispatch({ type: "TOAST", text, kind }),
    dismissToast: (id) => dispatch({ type: "DISMISS_TOAST", id }),
    setFlag: (key, value) => dispatch({ type: "SET_FLAG", key, value }),
  };

  return <GameContext.Provider value={{ state, actions }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame måste användas inom GameProvider");
  return ctx;
}
