export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface TriviaConfig {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  count: number;
}

export interface ApiResponse {
  questions: TriviaQuestion[];
  success: boolean;
  message?: string;
}

export type DifficultyLevel = "easy" | "medium" | "hard";

export const TRIVIA_TOPICS = [
  "Movies", // ✅ Format 1 working
  "Sports", // ✅ Format 2 working
  "Mathematics", // ✅ Format 1 working
  "Science", // ✅ Format 1 working
  "History", // ⚠️ Format 3 partial issue
  "Technology", // Backend tested
  "Geography",
  "Literature",
  "Music",
  "Art",
] as const;

export type TriviaTopics = (typeof TRIVIA_TOPICS)[number];
