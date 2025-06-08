import React from "react";

interface QuestionCountSelectorProps {
  selectedCount: number | null;
  onCountSelect: (count: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20];

export const QuestionCountSelector: React.FC<QuestionCountSelectorProps> = ({
  selectedCount,
  onCountSelect,
  onBack,
  onNext,
}) => {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-5xl mx-auto" style={{ marginTop: "6rem" }}>
        <div className="text-center mb-16 sm:mb-20 fade-in-up">
          <h2 className="text-3xl sm:text-4xl heading-primary mb-4 sm:mb-6">
            Choose Question Count
          </h2>
          <p className="text-base sm:text-lg opacity-75 text-playful max-w-md mx-auto">
            How many questions would you like to answer?
          </p>
        </div>

        <div
          className="grid gap-4 mb-8 mx-auto px-4"
          style={{
            gridTemplateColumns: "repeat(4, 160px)",
            gap: "1.5rem",
            width: "fit-content",
            marginTop: "4rem",
          }}
        >
          {QUESTION_COUNT_OPTIONS.map((count, index) => (
            <div
              key={count}
              className="fade-in-up flex justify-center"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <button
                onClick={() => onCountSelect(count)}
                className={`glass-card w-[160px] h-[85px] transition-all duration-500 hover:scale-105 ${
                  selectedCount === count
                    ? "topic-selected scale-105 shadow-glow"
                    : "hover:bg-white/15"
                }`}
              >
                <div className="text-center p-3 h-full flex flex-col justify-center">
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      selectedCount === count ? "text-white" : "text-playful"
                    }`}
                  >
                    {count}
                  </div>
                  <div
                    className={`text-xs ${
                      selectedCount === count
                        ? "opacity-90 text-blue-100"
                        : "opacity-60"
                    }`}
                  >
                    {count === 5
                      ? "Quick Session"
                      : count === 10
                      ? "Standard Round"
                      : count === 15
                      ? "Extended Quiz"
                      : "Marathon Mode"}
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
              disabled={!selectedCount}
              className={`text-playful transition-opacity duration-200 text-sm px-3 py-2 ${
                !selectedCount
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              Start Trivia →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
