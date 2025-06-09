import React, { useState } from "react";
import { TRIVIA_TOPICS } from "../types";
import type { TriviaTopics } from "../types";

interface TopicSelectorProps {
  selectedTopic: string;
  onTopicSelect: (topic: TriviaTopics | string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopic,
  onTopicSelect,
  onBack,
  onNext,
}) => {
  const [customTopic, setCustomTopic] = useState("");
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const handlePredefinedTopicSelect = (topic: TriviaTopics) => {
    setIsCustomSelected(false);
    setCustomTopic("");
    onTopicSelect(topic);
  };

  const handleCustomTopicChange = (value: string) => {
    setCustomTopic(value);
    if (value.trim()) {
      setIsCustomSelected(true);
      onTopicSelect(value.trim());
    } else {
      setIsCustomSelected(false);
    }
  };
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-5xl mx-auto" style={{ marginTop: "6rem" }}>
        <div className="text-center mb-16 sm:mb-20 fade-in-up">
          <h2 className="text-3xl sm:text-4xl heading-primary mb-4 sm:mb-6">
            Choose Your Topic
          </h2>
          <p className="text-base sm:text-lg opacity-75 text-playful max-w-md mx-auto">
            What kind of trivia challenges you the most?
          </p>
        </div>

        <div
          className="grid gap-6 mx-auto px-4 justify-items-center topic-grid"
          style={{
            gridTemplateColumns: "repeat(2, 160px)", // 2 columns on mobile
            gap: "1.5rem",
            marginBottom: "4rem",
            marginTop: "4rem",
          }}
        >
          {TRIVIA_TOPICS.map((topic, index) => (
            <div
              key={topic}
              className="fade-in-up flex justify-center"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <button
                onClick={() => handlePredefinedTopicSelect(topic)}
                className={`glass-card w-[160px] h-[85px] transition-all duration-500 hover:scale-105 text-white ${
                  selectedTopic === topic && !isCustomSelected
                    ? "topic-selected scale-105 shadow-glow"
                    : "hover:bg-white/15"
                }`}
              >
                <div className="text-center p-3 h-full flex flex-col justify-center">
                  <div
                    className={`text-base font-semibold mb-1 text-white ${
                      selectedTopic === topic && !isCustomSelected
                        ? "font-bold text-lg"
                        : ""
                    }`}
                  >
                    {topic}
                  </div>
                  <div
                    className={`text-xs text-white ${
                      selectedTopic === topic && !isCustomSelected
                        ? "opacity-90"
                        : "opacity-60"
                    }`}
                  >
                    {getTopicDescription(topic)}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Custom Topic Section - Better positioned with proper spacing */}
        <div
          className="text-center fade-in-up delay-300"
          style={{ marginBottom: "2rem" }}
        >
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <span className="text-playful opacity-75 text-sm whitespace-nowrap">
              Can't find your favourite topic!&nbsp;
            </span>
            <div className="relative">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => handleCustomTopicChange(e.target.value)}
                placeholder="Enter your own..."
                className={`text-playful transition-opacity duration-200 text-sm px-3 py-2 text-center w-48 ${
                  isCustomSelected && customTopic.trim()
                    ? "opacity-100 font-medium"
                    : "opacity-75"
                } focus:outline-none focus:opacity-100 hover:opacity-100 placeholder-white/50`}
                maxLength={30}
              />
              {/* {customTopic.trim() && (
                <div className="absolute -bottom-6 left-0 right-0">
                  <span className="text-xs text-green-400 opacity-75">
                    ✓ Custom
                  </span>
                </div>
              )} */}
            </div>
          </div>
        </div>

        <div
          className="text-center fade-in-up delay-400"
          style={{ marginTop: "3rem" }}
        >
          <div
            className="flex justify-center items-center gap-4 flex-wrap"
            style={{ gap: "2rem" }}
          >
            <button
              onClick={onBack}
              className="text-playful opacity-75 hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1"
            >
              ← Back
            </button>
            <button
              onClick={onNext}
              disabled={!selectedTopic}
              className={`text-playful transition-opacity duration-200 text-sm px-3 py-2 ${
                !selectedTopic
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTopicDescription = (topic: TriviaTopics): string => {
  const descriptions: Record<TriviaTopics, string> = {
    Movies: "Film & Cinema",
    Sports: "Athletic Events",
    Mathematics: "Numbers & Logic",
    Science: "Natural World",
    History: "Past Events",
    Technology: "Digital Age",
    Geography: "World Places",
    Literature: "Books & Authors",
    Music: "Music & Artists",
    Art: "Art & Designs",
  };
  return descriptions[topic];
};
