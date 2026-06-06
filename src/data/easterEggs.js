// Humoristiska easter eggs. Funktionerna returnerar ett meddelande (eller null)
// som visas som en toast. Trösklarna kollas mot räknare i spelstaten.

export const EGG_MESSAGES = {
  wrong3: "Skynet börjar bli oroligt...",
  wrong5: "Har du provat att starta om hjärnan?",
  streak5: "Combo! Kodguden är imponerad.",
  perfectRoom: "Perfekt! Ingen bugg hittades.",
  doorSpam: "Dörren blir inte öppnare...",
  beerEarly: "Först jobbet. Sedan ölen.",
  konami: "↑↑↓↓←→←→BA – fusket aktiverat! (fast det gör inget...)",
  secretClick: "Du hittade en hemlighet! 🥚",
};

// Roliga kommentarer som slumpas in vid rätt/fel om frågan saknar egen quip.
export const GENERIC_CORRECT = [
  "Precis! Det där hade till och med ChatGPT svarat rätt på.",
  "Snyggt! En riktig kodare.",
  "Korrekt! Inga buggar här inte.",
  "Rätt! Compilern ler.",
];

export const GENERIC_WRONG = [
  "Aj då... Skynet antecknade just ditt namn.",
  "Nästan! Men nej.",
  "Fel – men buggar lär man sig av.",
  "Det där gav en stackdump i hjärnan.",
];

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
