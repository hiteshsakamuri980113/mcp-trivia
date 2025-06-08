import React from "react";

interface WelcomeSectionProps {
  onStart: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center">
        <div className="p-8 sm:p-12 lg:p-16 fade-in-up">
          <h1 className="heading-primary text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 tracking-tight">
            TRIVIA
          </h1>
          <p className="text-playful text-lg sm:text-xl opacity-90 mb-8 sm:mb-12 leading-relaxed max-w-lg mx-auto">
            Test your knowledge across diverse topics
          </p>
          <button
            onClick={onStart}
            className="text-playful opacity-75 hover:opacity-100 transition-opacity duration-200 text-sm px-3 py-2"
          >
            Begin →
          </button>
        </div>
      </div>
    </div>
  );
};
