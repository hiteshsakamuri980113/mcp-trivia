import React, { useState, useEffect } from "react";
import type { TriviaQuestion } from "../types";

interface IndividualQuestionDisplayProps {
  questions: TriviaQuestion[];
  onComplete: (answers: (number | null)[]) => void;
  onBack: () => void;
}

export const IndividualQuestionDisplay: React.FC<
  IndividualQuestionDisplayProps
> = ({ questions, onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    setSelectedAnswer(userAnswers[currentQuestionIndex]);
  }, [currentQuestionIndex, userAnswers]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canGoNext = selectedAnswer !== null;
  const canGoPrevious = currentQuestionIndex > 0;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(userAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      onComplete(userAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div
      className="min-h-screen px-4 pb-12 sm:pb-8"
      style={{ paddingTop: "8rem" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with Progress */}
        <div className="text-center mb-6 sm:mb-8 fade-in-up">
          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-playful opacity-75">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-xs sm:text-sm text-playful opacity-75">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card - REMOVED glass-card from container */}
        <div className="fade-in-up delay-100">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-playful mb-6 sm:mb-8 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div
            className="mb-8 sm:mb-12"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "150px",
            }}
          >
            {currentQuestion.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => handleAnswerSelect(optionIndex)}
                className={`
                  trivia-option text-left glass-card transition-all duration-300 hover:bg-white/20 cursor-pointer
                  ${
                    selectedAnswer === optionIndex
                      ? "answer-selected scale-105 shadow-glow bg-white/15 border-2 border-blue-400/50"
                      : "hover:bg-white/15 hover:scale-102"
                  }
                `}
              >
                <span className="text-white leading-relaxed">{option}</span>
              </button>
            ))}
          </div>

          {/* Navigation - FIXED: Centered with gaps between buttons */}
          <div
            className="flex justify-center items-center"
            style={{ gap: "16px" }}
          >
            <button
              onClick={onBack}
              className="text-playful opacity-75 hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1"
            >
              ← Exit
            </button>

            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className={`text-playful transition-opacity duration-200 text-xs px-2 py-1 ${
                !canGoPrevious
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={handleSkip}
              className="text-playful opacity-75 hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1"
            >
              Skip →
            </button>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`text-playful transition-opacity duration-200 text-xs px-2 py-1 ${
                !canGoNext
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              {isLastQuestion ? "Finish →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
