# 🏠 Solhem Escape – Kodäventyret

Ett escape room-/quiz-äventyr i webbläsaren. Du är inlåst i det gula huset **Solhem**
under kodadagen och måste ta dig igenom 11 rum fyllda med kod- och teknikutmaningar –
ända fram till bastun och en kall öl. 🍺

Byggt med **React + Vite**. Frontend serveras i produktion via en liten **Express-server**
och körs i **Docker** på `caddy_net`.

## Kom igång lokalt

```bash
npm install
npm run dev      # startar på http://localhost:3023
```

## Bygg & kör som i produktion

```bash
npm run build    # bygger till dist/
npm start        # serverar dist/ via Express (PORT från .env)
```

## Docker

```bash
docker compose up -d --build
```

## Lägg till ett nytt rum

1. Skapa en JSON-fil i [`src/data/rooms/`](src/data/rooms/) (t.ex. `12-mittnyarum.json`).
2. Sätt unikt `id` och nästa `order`-nummer.
3. Lägg till frågor (se schemat nedan). Klart – rummet plockas upp automatiskt.

### Frågetyper

| `type`              | Beskrivning                       | Nyckelfält                |
| ------------------- | --------------------------------- | ------------------------- |
| `multiple-choice`   | Flerval                           | `options`, `answer` (idx) |
| `true-false`        | Sant/Falskt                       | `answer` (bool)           |
| `match`             | Matcha begrepp                    | `pairs[{term,match}]`     |
| `code-puzzle`       | Sortera kodrader (drag)           | `lines` (rätt ordning)    |
| `dragdrop`          | Dra begrepp till hinkar           | `bins`, `items`           |
| `image`             | Bildfråga (URL eller emoji)       | `image`, `options`, `answer` |
| `fill-missing-line` | Kod som saknar en rad (`___`)     | `code`, `options`, `answer` |
| `mini-challenge`    | Skriv svaret själv                | `accept` (lista)          |
| `timed-bonus`       | Tidsbegränsat flerval             | `options`, `answer`, `time` |

Alla frågor kan ha `explanation` (förklaring) och `quip` (rolig kommentar).

## Ljud

Ljudsystemet finns i [`src/audio/AudioManager.js`](src/audio/AudioManager.js) med krokar
(`playSfx`, `playMusic`) men inga ljudfiler ännu. Lägg filer i `public/audio/` och fyll i
mappningarna för att aktivera ljud – ingen annan kod behöver ändras.

## Funktioner

- 11 teman med egen färg, ikon och atmosfär
- Achievements, easter eggs och kombo-system
- Autospar i `localStorage` (fortsätt där du slutade)
- Slutscen i bastun med konfetti och fyrverkerier
- Dolda hemligheter (testa Konami-koden 😉)
