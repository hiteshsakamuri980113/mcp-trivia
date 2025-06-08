import React from "react";

interface ErrorDisplayProps {
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen px-4 py-16 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl mb-6">
          Oopsie, there seems to be an error. Please try again.
        </h2>

        <button
          onClick={onRetry}
          className="text-playful opacity-75 hover:opacity-100 transition-opacity duration-200 text-sm px-4 py-2 mt-4"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
