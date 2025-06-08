import React from "react";
import type { TriviaQuestion } from "../types";

interface FinalReportProps {
  questions: TriviaQuestion[];
  userAnswers: (number | null)[];
  onRestart: () => void;
  onReviewAnswers: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({
  questions,
  userAnswers,
  onRestart,
  onReviewAnswers,
}) => {
  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const score = calculateScore();
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const answeredQuestions = userAnswers.filter(
    (answer) => answer !== null
  ).length;
  const skippedQuestions = totalQuestions - answeredQuestions;

  const getScoreMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a trivia master!";
    if (percentage >= 80) return "Excellent work! Great knowledge!";
    if (percentage >= 70) return "Good job! Well done!";
    if (percentage >= 60) return "Not bad! Keep practicing!";
    return "Good effort! Try again for a better score!";
  };

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div
      className="min-h-screen px-4 py-6 sm:py-8"
      style={{ paddingTop: "6rem" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Score Card */}
        <div className="text-center mb-8 sm:mb-12 fade-in-up max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl heading-primary mb-4 sm:mb-6">
            Quiz Complete! 🎉
          </h1>

          <div
            className={`text-4xl sm:text-6xl lg:text-8xl font-bold mb-3 sm:mb-4 ${getScoreColor()}`}
          >
            {score}/{totalQuestions}
          </div>

          <div
            className={`text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 ${getScoreColor()}`}
          >
            {percentage}%
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-playful mb-6 sm:mb-8 max-w-lg mx-auto">
            {getScoreMessage()}
          </p>

          {/* Quick Stats */}
          <div
            className="grid gap-4 mb-8 mx-auto"
            style={{
              gridTemplateColumns: "repeat(3, 160px)",
              gap: "1.5rem",
              width: "fit-content",
              marginTop: "2rem",
            }}
          >
            <div className="glass-card w-[160px] h-[85px] flex flex-col justify-center items-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
                {score}
              </div>
              <div className="text-xs sm:text-sm opacity-75">Correct</div>
            </div>
            <div className="glass-card w-[160px] h-[85px] flex flex-col justify-center items-center">
              <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">
                {answeredQuestions - score}
              </div>
              <div className="text-xs sm:text-sm opacity-75">Incorrect</div>
            </div>
            <div className="glass-card w-[160px] h-[85px] flex flex-col justify-center items-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1">
                {skippedQuestions}
              </div>
              <div className="text-xs sm:text-sm opacity-75">Skipped</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex justify-center items-center flex-wrap"
            style={{ marginTop: "3rem", gap: "1rem" }}
          >
            <button
              onClick={onReviewAnswers}
              className="text-playful opacity-75 hover:opacity-100 transition-opacity duration-200 text-sm px-3 py-2"
            >
              Review Answers
            </button>

            <button
              onClick={onRestart}
              className="text-playful opacity-75 hover:opacity-100 transition-opacity duration-200 text-sm px-3 py-2"
            >
              New Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
