import type { TriviaConfig, ApiResponse, TriviaQuestion } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Backend response interface (matches the actual backend format)
interface BackendTriviaQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface BackendApiResponse {
  success: boolean;
  questions: BackendTriviaQuestion[];
  message?: string;
}

// Transform backend question format to frontend format
function transformQuestion(
  backendQuestion: BackendTriviaQuestion,
  index: number
): TriviaQuestion {
  return {
    id: (index + 1).toString(),
    question: backendQuestion.question,
    options: backendQuestion.options,
    correctAnswer: backendQuestion.correct_answer,
    explanation: backendQuestion.explanation,
  };
}

export const triviaApi = {
  async fetchQuestions(config: TriviaConfig): Promise<ApiResponse> {
    try {
      console.log("Fetching questions with config:", config);

      const response = await fetch(`${API_BASE_URL}/api/get-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: config.topic,
          difficulty: config.difficulty,
          count: config.count,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const backendResponse: BackendApiResponse = await response.json();
      console.log("Backend response:", backendResponse);

      if (backendResponse.success && backendResponse.questions) {
        // Transform backend format to frontend format
        const transformedQuestions =
          backendResponse.questions.map(transformQuestion);

        return {
          success: true,
          questions: transformedQuestions,
          message: backendResponse.message,
        };
      } else {
        throw new Error(backendResponse.message || "Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching trivia questions:", error);

      // Return error state instead of mock data
      return {
        success: false,
        questions: [],
        message:
          error instanceof Error ? error.message : "Failed to fetch questions",
      };
    }
  },
};
