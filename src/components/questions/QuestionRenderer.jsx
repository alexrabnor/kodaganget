import MultipleChoice from "./MultipleChoice.jsx";
import TrueFalse from "./TrueFalse.jsx";
import Match from "./Match.jsx";
import CodePuzzle from "./CodePuzzle.jsx";
import DragDrop from "./DragDrop.jsx";
import ImageQuestion from "./ImageQuestion.jsx";
import FillMissingLine from "./FillMissingLine.jsx";
import MiniChallenge from "./MiniChallenge.jsx";
import TimedBonus from "./TimedBonus.jsx";

// Kopplar question.type till rätt komponent.
const REGISTRY = {
  "multiple-choice": MultipleChoice,
  "true-false": TrueFalse,
  match: Match,
  "code-puzzle": CodePuzzle,
  dragdrop: DragDrop,
  image: ImageQuestion,
  "fill-missing-line": FillMissingLine,
  "mini-challenge": MiniChallenge,
  "timed-bonus": TimedBonus,
};

const TYPE_LABELS = {
  "multiple-choice": "Flervalsfråga",
  "true-false": "Sant eller falskt",
  match: "Matcha begrepp",
  "code-puzzle": "Kodpussel",
  dragdrop: "Dra och släpp",
  image: "Bildfråga",
  "fill-missing-line": "Fyll i raden som saknas",
  "mini-challenge": "Miniutmaning",
  "timed-bonus": "Tidsbonus",
};

export function typeLabel(type) {
  return TYPE_LABELS[type] || "Fråga";
}

export default function QuestionRenderer({ question, locked, onAnswered }) {
  const Component = REGISTRY[question.type] || MultipleChoice;
  return <Component question={question} locked={locked} onAnswered={onAnswered} />;
}
