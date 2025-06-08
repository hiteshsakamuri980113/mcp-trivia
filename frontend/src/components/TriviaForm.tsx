import React, { useState } from "react";
import { TopicSelector } from "./TopicSelector";
import { DifficultySelector } from "./DifficultySelector";
import { QuestionCountSelector } from "./QuestionCountSelector";
import { ErrorDisplay } from "./ErrorDisplay";
import type { DifficultyLevel, TriviaConfig } from "../types";
import { triviaApi } from "../services/api";

interface TriviaFormProps {
  onQuestionsLoaded: (questions: any[]) => void;
  onBack: () => void;
}

type FormStep = "topic" | "difficulty" | "count";

export const TriviaForm: React.FC<TriviaFormProps> = ({
  onQuestionsLoaded,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState<FormStep>("topic");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel | null>(null);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleTopicNext = () => {
    if (selectedTopic) {
      setCurrentStep("difficulty");
    }
  };

  const handleDifficultyNext = () => {
    if (selectedDifficulty) {
      setCurrentStep("count");
    }
  };

  const handleStartTrivia = async () => {
    if (!selectedTopic || !selectedDifficulty || !selectedCount) return;

    setIsLoading(true);
    setError(false);

    try {
      const config: TriviaConfig = {
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        count: selectedCount,
      };

      const response = await triviaApi.fetchQuestions(config);

      if (response.success) {
        // Limit questions to selected count
        const limitedQuestions = response.questions.slice(0, selectedCount);
        onQuestionsLoaded(limitedQuestions);
      } else {
        console.error("API error:", response.message);
        setError(true);
      }
    } catch (error) {
      console.error("Error starting trivia:", error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "topic") {
      onBack();
    } else if (currentStep === "difficulty") {
      setCurrentStep("topic");
    } else if (currentStep === "count") {
      setCurrentStep("difficulty");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-playful text-base sm:text-lg">
            Loading your trivia questions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay onRetry={handleStartTrivia} />;
  }

  if (currentStep === "topic") {
    return (
      <TopicSelector
        selectedTopic={selectedTopic}
        onTopicSelect={setSelectedTopic}
        onBack={handleBack}
        onNext={handleTopicNext}
      />
    );
  }

  if (currentStep === "difficulty") {
    return (
      <DifficultySelector
        selectedDifficulty={selectedDifficulty}
        onDifficultySelect={setSelectedDifficulty}
        onBack={handleBack}
        onNext={handleDifficultyNext}
      />
    );
  }

  if (currentStep === "count") {
    return (
      <QuestionCountSelector
        selectedCount={selectedCount}
        onCountSelect={setSelectedCount}
        onBack={handleBack}
        onNext={handleStartTrivia}
      />
    );
  }

  return null;
};
