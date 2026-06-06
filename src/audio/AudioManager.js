// Ljudsystem med tydliga krokar men UTAN faktiska ljudfiler i v1.
// Lägg ljudfiler i /public/audio/ och fyll i mappningarna nedan för att
// aktivera ljud – ingen annan kod behöver ändras.

const SFX_FILES = {
  // correct: "/audio/correct.mp3",
  // wrong: "/audio/wrong.mp3",
  // unlock: "/audio/unlock.mp3",
  // win: "/audio/win.mp3",
  // click: "/audio/click.mp3",
};

const MUSIC_FILES = {
  // skynet: "/audio/music/skynet.mp3",
  // jwt: "/audio/music/jwt.mp3",
  // ... ett spår per rum-tema
};

let enabled = true;
let currentMusic = null;

const cache = new Map();

function getAudio(src) {
  if (!cache.has(src)) cache.set(src, new Audio(src));
  return cache.get(src);
}

export const AudioManager = {
  setEnabled(value) {
    enabled = value;
    if (!value && currentMusic) currentMusic.pause();
  },

  isEnabled() {
    return enabled;
  },

  // Spela en kort ljudeffekt. No-op tills SFX_FILES fyllts i.
  playSfx(name) {
    if (!enabled) return;
    const src = SFX_FILES[name];
    if (!src) return; // hook – inget ljud ännu
    try {
      const a = getAudio(src);
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {
      /* ignoreras */
    }
  },

  // Byt bakgrundsmusik till rummets tema. No-op tills MUSIC_FILES fyllts i.
  playMusic(themeKey) {
    if (!enabled) return;
    const src = MUSIC_FILES[themeKey];
    if (!src) return; // hook – ingen musik ännu
    try {
      if (currentMusic) currentMusic.pause();
      const a = getAudio(src);
      a.loop = true;
      a.volume = 0.4;
      a.play().catch(() => {});
      currentMusic = a;
    } catch {
      /* ignoreras */
    }
  },

  stopMusic() {
    if (currentMusic) currentMusic.pause();
    currentMusic = null;
  },
};
