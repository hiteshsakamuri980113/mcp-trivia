import { useState } from "react";
import { WelcomeSection } from "./components/WelcomeSection";
import { TriviaForm } from "./components/TriviaForm";
import { IndividualQuestionDisplay } from "./components/IndividualQuestionDisplay";
import { FinalReport } from "./components/FinalReport";
import { QuestionsDisplay } from "./components/QuestionsDisplay";
import type { TriviaQuestion } from "./types";
import "./App.css";

type AppState =
  | "welcome"
  | "form"
  | "individual-questions"
  | "final-report"
  | "review-answers";

function App() {
  const [currentState, setCurrentState] = useState<AppState>("welcome");
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const handleStart = () => {
    setCurrentState("form");
  };

  const handleQuestionsLoaded = (loadedQuestions: TriviaQuestion[]) => {
    setQuestions(loadedQuestions);
    setUserAnswers(new Array(loadedQuestions.length).fill(null));
    setCurrentState("individual-questions");
  };

  const handleQuizComplete = (answers: (number | null)[]) => {
    setUserAnswers(answers);
    setCurrentState("final-report");
  };

  const handleReviewAnswers = () => {
    setCurrentState("review-answers");
  };

  // const handleRestart = () => {
  //   setQuestions([]);
  //   setUserAnswers([]);
  //   setCurrentState("welcome");
  // };

  const handleBackToWelcome = () => {
    setCurrentState("welcome");
  };

  const handleBackToSetUp = () => {
    setCurrentState("form");
  };

  const handleBackToReport = () => {
    setCurrentState("final-report");
  };

  return (
    <>
      {currentState === "welcome" && <WelcomeSection onStart={handleStart} />}

      {currentState === "form" && (
        <TriviaForm
          onQuestionsLoaded={handleQuestionsLoaded}
          onBack={handleBackToWelcome}
        />
      )}

      {currentState === "individual-questions" && (
        <IndividualQuestionDisplay
          questions={questions}
          onComplete={handleQuizComplete}
          onBack={handleBackToSetUp}
        />
      )}

      {currentState === "final-report" && (
        <FinalReport
          questions={questions}
          userAnswers={userAnswers}
          onRestart={handleBackToSetUp}
          onReviewAnswers={handleReviewAnswers}
        />
      )}

      {currentState === "review-answers" && (
        <QuestionsDisplay
          questions={questions}
          userAnswers={userAnswers}
          onBack={handleBackToReport}
        />
      )}
    </>
  );
}

export default App;
