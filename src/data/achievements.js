// Achievement-definitioner. Lägg enkelt till fler här.
// `hidden: true` döljer beskrivningen tills den låsts upp.

export const ACHIEVEMENTS = [
  { id: "first-correct", icon: "🏆", title: "Första rätt", desc: "Du svarade rätt på din första fråga." },
  { id: "five-streak", icon: "🔥", title: "Fem rätt i rad", desc: "Fem korrekta svar på raken." },
  { id: "bug-hunter", icon: "🐛", title: "Bug Hunter", desc: "Klara rummet 'Min sämsta bugg'." },
  { id: "token-master", icon: "🔑", title: "Token Master", desc: "Klara JWT-rummet." },
  { id: "unity-wizard", icon: "🧊", title: "Unity Wizard", desc: "Klara Unity-rummet." },
  { id: "flutter-hero", icon: "📱", title: "Flutter Hero", desc: "Klara Flutter-rummet." },
  { id: "ai-survivor", icon: "🤖", title: "AI Survivor", desc: "Överlev Skynet-rummet." },
  { id: "perfect-room", icon: "✨", title: "Felfri", desc: "Klara ett rum helt utan fel." },
  { id: "bastumastare", icon: "🧖", title: "Bastumästare", desc: "Ta dig hela vägen till bastun." },
  { id: "kodlegend", icon: "👑", title: "Kodlegend", desc: "Lås upp alla andra achievements.", hidden: true },
  // Dolda hemligheter:
  { id: "konami", icon: "🎮", title: "Gamer", desc: "Du hittade en hemlig kod...", hidden: true },
  { id: "beer-tease", icon: "🍺", title: "Tålamod", desc: "Du försökte ta ölen för tidigt.", hidden: true },
  { id: "stubborn-door", icon: "🚪", title: "Envis", desc: "Du gav verkligen den dörren en chans.", hidden: true },
];

// Snabb uppslagning på id.
export const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

// Kopplar ett rum-id till den achievement som låses upp när rummet klaras.
export const ROOM_ACHIEVEMENT = {
  skynet: "ai-survivor",
  jwt: "token-master",
  unity: "unity-wizard",
  flutter: "flutter-hero",
  bugg: "bug-hunter",
};
