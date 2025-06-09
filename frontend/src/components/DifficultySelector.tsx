import React from "react";
import type { DifficultyLevel } from "../types";

interface DifficultySelectorProps {
  selectedDifficulty: DifficultyLevel | null;
  onDifficultySelect: (difficulty: DifficultyLevel) => void;
  onBack: () => void;
  onNext: () => void;
}

const difficulties: DifficultyLevel[] = ["easy", "medium", "hard"];

const difficultyInfo: Record<
  DifficultyLevel,
  { label: string; description: string }
> = {
  easy: { label: "Easy", description: "Perfect for beginners" },
  medium: { label: "Medium", description: "A good challenge" },
  hard: { label: "Hard", description: "For trivia experts" },
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultySelect,
  onBack,
  onNext,
}) => {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-5xl mx-auto" style={{ marginTop: "6rem" }}>
        <div className="text-center mb-16 sm:mb-20 fade-in-up">
          <h2 className="text-3xl sm:text-4xl heading-primary mb-4 sm:mb-6">
            Select Difficulty
          </h2>
          <p className="text-base sm:text-lg opacity-75 text-playful max-w-md mx-auto">
            How challenging do you want your trivia to be?
          </p>
        </div>

        <div
          className="grid gap-4 mb-8 mx-auto px-4 justify-items-center difficulty-grid"
          style={{
            gridTemplateColumns: "repeat(1, 160px)", // 1 column on mobile
            gap: "1.5rem",
            width: "fit-content",
            marginTop: "4rem",
          }}
        >
          {difficulties.map((difficulty, index) => (
            <div
              key={difficulty}
              className="fade-in-up flex justify-center"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <button
                onClick={() => onDifficultySelect(difficulty)}
                className={`glass-card w-[160px] h-[85px] transition-all duration-500 hover:scale-105 text-white ${
                  selectedDifficulty === difficulty
                    ? "topic-selected scale-105 shadow-glow"
                    : "hover:bg-white/15"
                }`}
              >
                <div className="text-center p-3 h-full flex flex-col justify-center">
                  <div
                    className={`text-3xl font-bold mb-2 text-white ${
                      selectedDifficulty === difficulty ? "" : ""
                    }`}
                  >
                    {difficultyInfo[difficulty].label}
                  </div>
                  <div
                    className={`text-xs text-white ${
                      selectedDifficulty === difficulty
                        ? "opacity-90"
                        : "opacity-60"
                    }`}
                  >
                    {difficultyInfo[difficulty].description}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        <div
          className="text-center fade-in-up delay-400"
          style={{ marginTop: "4rem" }}
        >
          <div
            className="flex justify-center items-center gap-4 flex-wrap"
            style={{ gap: "1rem" }}
          >
            <button
              onClick={onBack}
              className="text-playful opacity-75 hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1"
            >
              ← Back
            </button>
            <button
              onClick={onNext}
              disabled={!selectedDifficulty}
              className={`text-playful transition-opacity duration-200 text-sm px-3 py-2 ${
                !selectedDifficulty
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
