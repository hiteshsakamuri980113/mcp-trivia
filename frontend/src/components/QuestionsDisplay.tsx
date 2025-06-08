import React, { useState } from "react";
import type { TriviaQuestion } from "../types";

interface QuestionsDisplayProps {
  questions: TriviaQuestion[];
  userAnswers?: (number | null)[];
  onBack?: () => void;
}

interface QuestionState {
  selectedAnswer: number | null;
  showResult: boolean;
}

export const QuestionsDisplay: React.FC<QuestionsDisplayProps> = ({
  questions,
  userAnswers: providedAnswers,
  onBack,
}) => {
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(() => {
    if (providedAnswers) {
      return questions.map((_, index) => ({
        selectedAnswer: providedAnswers[index],
        showResult: true,
      }));
    }
    return questions.map(() => ({ selectedAnswer: null, showResult: false }));
  });

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (questionStates[questionIndex].showResult) return;

    const newStates = [...questionStates];
    newStates[questionIndex] = {
      selectedAnswer: answerIndex,
      showResult: false,
    };
    setQuestionStates(newStates);
  };

  const handleRevealAnswer = (questionIndex: number) => {
    const newStates = [...questionStates];
    newStates[questionIndex] = {
      ...newStates[questionIndex],
      showResult: true,
    };
    setQuestionStates(newStates);
  };

  const handleSkipQuestion = (questionIndex: number) => {
    const newStates = [...questionStates];
    newStates[questionIndex] = {
      selectedAnswer: null,
      showResult: true,
    };
    setQuestionStates(newStates);
  };

  const handleShowAllResults = () => {
    const newStates = questionStates.map((state) => ({
      ...state,
      showResult: true,
    }));
    setQuestionStates(newStates);
  };

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      const state = questionStates[index];
      if (state.selectedAnswer === question.correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const allAnswered = questionStates.every(
    (state) => state.selectedAnswer !== null
  );
  const allRevealed = questionStates.every((state) => state.showResult);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div
          className="text-center mb-8 fade-in-up"
          style={{ marginBottom: "40px" }}
        >
          <h1 className="text-3xl sm:text-4xl heading-primary mb-3 sm:mb-4">
            {providedAnswers ? "Review Answers" : "Trivia Challenge"}
          </h1>

          {/* Score Display */}
          {allAnswered && (
            <div className="mb-6 fade-in-up">
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-playful mb-2">
                  Score: {calculateScore()}/{questions.length} (
                  {Math.round((calculateScore() / questions.length) * 100)}%)
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons - FIXED: Made compact */}
          {!allRevealed && (
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={handleShowAllResults}
                className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
              >
                Reveal All Answers
              </button>
            </div>
          )}

          {/* {allAnswered && (
            <button
              onClick={onRestart}
              className="glass-card px-6 py-3 rounded-full text-playful hover:bg-white/20 transition-all duration-300"
            >
              New Quiz
            </button>
          )} */}
        </div>

        {/* Questions List - FIXED: Removed glass containers from questions, kept only on answer options */}
        <div className="space-y-12">
          {questions.map((question, questionIndex) => {
            const state = questionStates[questionIndex];
            const hasAnswer = state.selectedAnswer !== null;

            return (
              <>
                <div
                  key={questionIndex}
                  className="fade-in-up"
                  style={{ marginBottom: "2rem" }}
                >
                  <div className="flex items-baseline gap-8">
                    {/* Main Question Content */}
                    <div className="flex-1">
                      {/* Question Header */}
                      <div
                        className="flex items-baseline mb-3"
                        style={{ gap: "0.5rem" }}
                      >
                        <span
                          className="text-xl"
                          style={{
                            // fontSize: "1.5rem",
                            fontWeight: "900",
                            // lineHeight: "1",
                          }}
                        >
                          {questionIndex + 1}.
                        </span>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-white mb-2">
                            {question.question}
                          </h2>
                        </div>
                      </div>

                      {/* Action buttons - FIXED: Made compact with minimal margins */}
                      {!state.showResult && hasAnswer && (
                        <div
                          className="flex gap-2 mb-2"
                          style={{ marginBottom: "0.5rem" }}
                        >
                          <button
                            onClick={() => handleRevealAnswer(questionIndex)}
                            className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                          >
                            Reveal
                          </button>
                          <button
                            onClick={() => handleSkipQuestion(questionIndex)}
                            className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                          >
                            Skip
                          </button>
                        </div>
                      )}

                      {/* Answer Options - Enhanced prominence and simplified revealed design */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {question.options.map((option, optionIndex) => {
                          const isSelected =
                            state.selectedAnswer === optionIndex;
                          const isCorrectOption =
                            optionIndex === question.correctAnswer;
                          const showResult = state.showResult;

                          return (
                            <button
                              key={optionIndex}
                              onClick={() =>
                                handleAnswerSelect(questionIndex, optionIndex)
                              }
                              disabled={showResult}
                              className={`
                              glass-card p-8 text-left transition-all duration-300 block w-fit
                              ${
                                showResult
                                  ? "cursor-not-allowed"
                                  : "hover:bg-white/20 cursor-pointer hover:scale-102"
                              }
                            `}
                              style={{
                                border:
                                  showResult && isCorrectOption
                                    ? "3px solid rgba(34, 197, 94, 0.8)"
                                    : showResult &&
                                      isSelected &&
                                      !isCorrectOption
                                    ? "3px solid rgba(248, 113, 113, 0.8)"
                                    : isSelected && !showResult
                                    ? "2px solid rgba(59, 130, 246, 0.8)"
                                    : "1px solid rgba(255, 255, 255, 0.2)",
                                boxShadow:
                                  showResult && isCorrectOption
                                    ? "0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.4)"
                                    : showResult &&
                                      isSelected &&
                                      !isCorrectOption
                                    ? "0 0 30px rgba(248, 113, 113, 0.6), 0 0 60px rgba(248, 113, 113, 0.4)"
                                    : isSelected && !showResult
                                    ? "0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(59, 130, 246, 0.4)"
                                    : undefined,
                                backgroundColor:
                                  showResult && isCorrectOption
                                    ? "rgba(34, 197, 94, 0.2)"
                                    : showResult &&
                                      isSelected &&
                                      !isCorrectOption
                                    ? "rgba(248, 113, 113, 0.2)"
                                    : isSelected && !showResult
                                    ? "rgba(59, 130, 246, 0.15)"
                                    : undefined,
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className="font-bold text-2xl leading-relaxed"
                                  style={{ color: "#000000" }}
                                >
                                  {option}
                                </span>
                                {showResult && (
                                  <span className="text-2xl font-bold ml-4">
                                    {isCorrectOption ? (
                                      <span
                                        className="text-green-400 cursor-help"
                                        title="Correct Answer"
                                      >
                                        ✓
                                      </span>
                                    ) : (
                                      isSelected && (
                                        <span
                                          className="text-red-400 cursor-help"
                                          title="Incorrect Answer"
                                        >
                                          ✗
                                        </span>
                                      )
                                    )}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Section - With small left margin */}
                      {state.showResult && question.explanation && (
                        <div className="mt-4 pt-2 pl-1">
                          <div className="flex items-baseline">
                            <p
                              className="text-white/60 text-xs flex-1"
                              style={{ lineHeight: "1.4" }}
                            >
                              <span className="text-white/70 font-medium text-xs mr-2">
                                Explanation:&nbsp;
                              </span>
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Icon - Fixed to the right side and aligned with question */}
                    {state.showResult && (
                      <div className="flex-shrink-0 w-12 flex items-start justify-center">
                        <span
                          className={`text-2xl font-bold cursor-help ${
                            state.selectedAnswer === null
                              ? "text-yellow-400"
                              : state.selectedAnswer === question.correctAnswer
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                          title={
                            state.selectedAnswer === null
                              ? "Skipped"
                              : state.selectedAnswer === question.correctAnswer
                              ? "Correct"
                              : "Incorrect"
                          }
                        >
                          {state.selectedAnswer === null
                            ? "⏭"
                            : state.selectedAnswer === question.correctAnswer
                            ? "✓"
                            : "✗"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtle gradient divider between questions */}
                {questionIndex < questions.length - 1 && (
                  <div
                    className="mt-8 mb-6 mx-auto w-11/12 h-px opacity-30"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.6), transparent)",
                      boxShadow: "0 0 8px rgba(99, 102, 241, 0.3)",
                    }}
                  ></div>
                )}
              </>
            );
          })}
        </div>

        {/* Back to Setup Button at Bottom */}
        {onBack && (
          <div
            className="text-center fade-in-up"
            style={{ marginTop: "4rem", marginBottom: "2rem" }}
          >
            <button
              onClick={onBack}
              className="text-playful opacity-75 hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1"
            >
              ← Back to Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
