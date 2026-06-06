// Autospar till localStorage. Hela spelstaten serialiseras så att spelaren
// kan stänga fliken och fortsätta senare.

const STORAGE_KEY = "solhem-escape-save-v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Kunde inte läsa sparning:", err);
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Kunde inte spara:", err);
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Kunde inte rensa sparning:", err);
  }
}

export function hasSave() {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}
