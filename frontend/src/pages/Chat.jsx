import { useEffect, useRef, useState } from "react";
import { API_URL } from "../ai-helper/constants.js";
import { QuestionAnswer } from "../components/ai_components/QuestionAnswer.jsx";
import { RecentSearch } from "../components/ai_components/RecentSearch.jsx";
import { SuggestionButton } from "../components/ai_components/SuggestionButton.jsx";
const HISTORY_KEY = `plant_ai_history_v2`;

const MAX_RETRIES = 5;

async function safeFetchGeminiResponse(apiUrl, payload) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok && response.status < 500) {
        const errorBody = await response.json();
        throw new Error(
          `API Request Failed with Status ${response.status}: ${errorBody.error.message}`
        );
      }

      if (response.ok) {
        return await response.json();
      }

      if (response.status >= 500) {
        if (attempt === MAX_RETRIES - 1) {
          const errorBody = await response.json();
          throw new Error(
            `Gemini API call failed after ${MAX_RETRIES} retries. Last error: ${errorBody.error.message}`
          );
        }
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    } catch (error) {
      throw error;
    }
  }
  throw new Error("Failed to get response after maximum retries.");
}

<QuestionAnswer />;
<RecentSearch />;
<SuggestionButton />;
function App() {
  const [questionInput, setQuestionInput] = useState("");
  const [result, setResult] = useState([]);
  // Recent History now stores objects {id, query, timestamp}
  const [recentHistory, setRecentHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState("");
  const [loader, setLoader] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const scrollToAns = useRef();

  const fixedPrefix = "Can you share some plant information about ";
  const getHistory = () => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (e) {
      console.error("Error loading history from localStorage:", e);
      return [];
    }
  };
  const updateHistory = (prompt) => {
    // Clean up the prompt before saving (remove fixed prefix)
    const historyEntry = prompt.startsWith(fixedPrefix)
      ? prompt.substring(fixedPrefix.length).trim()
      : prompt;

    const newEntry = {
      // Capitalize first letter of the saved query
      query:
        historyEntry.charAt(0).toUpperCase() + historyEntry.slice(1).trim(),
      id: crypto.randomUUID(), // Use a UUID for a unique key
      timestamp: Date.now(),
    };

    setRecentHistory((prevHistory) => {
      // Add new entry to the beginning, limit to 20
      const updatedHistory = [newEntry, ...prevHistory.slice(0, 19)];
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Error saving history to localStorage:", e);
      }
      return updatedHistory;
    });
  };

  const handleClearHistory = () => {
    setRecentHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };
  const handleDeleteHistoryItem = (id) => {
    setRecentHistory((prevHistory) => {
      // Filter out the item with the matching ID
      const updatedHistory = prevHistory.filter((item) => item.id !== id);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (e) {
        console.error(
          "Error saving history to localStorage after deletion:",
          e
        );
      }
      return updatedHistory;
    });
  };

  useEffect(() => {
    setRecentHistory(getHistory());
  }, []); // Run only once on mount

  // Helper function to generate dummy suggestions based on the last question (prompt)
  const generateSuggestions = (prompt) => {
    const topic = prompt.toLowerCase().includes("monstera")
      ? "monstera"
      : prompt.toLowerCase().includes("succulent")
      ? "succulents"
      : prompt.toLowerCase().includes("ficus")
      ? "ficus"
      : "general";

    switch (topic) {
      case "monstera":
        return [
          "How often should I water my Monstera?",
          "What kind of fertilizer is best for Monstera?",
          "Why are the leaves turning yellow?",
        ];
      case "succulents":
        return [
          "What is the ideal soil mix for succulents?",
          "How much light do desert succulents need?",
          "How do I propagate a new succulent?",
        ];
      case "ficus":
        return [
          "How do I stop my Ficus from dropping leaves?",
          "What temperature range is safe for a Ficus?",
          "Does a Ficus need misting?",
        ];
      default:
        return [
          "What are the best low-light houseplants?",
          "How to check if soil is well-draining?",
          "Tell me about composting.",
        ];
    }
  };

  const askQuestion = async (prompt) => {
    setSelectedHistory("");
    setCurrentSuggestions([]);

    // Save question to LocalStorage first
    if (prompt) {
      updateHistory(prompt);
    }

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [
          {
            text: "You are 'Plant AI', a helpful and friendly expert on plant care, identification, and general botany. Respond concisely using bullet points when appropriate.",
          },
        ],
      },
    };

    setResult((prev) => [...prev, { type: "q", text: [prompt] }]);

    setLoader(true);
    setQuestionInput("");

    try {
      let response = await safeFetchGeminiResponse(API_URL, payload);

      if (!response.candidates || !response.candidates[0]) {
        console.error("Unexpected response:", response);
        // Display an error message to the user
        setResult((prev) => [
          ...prev.slice(0, -1), // Remove the question added above
          { type: "q", text: [prompt] },
          {
            type: "a",
            text: [
              "🤔 No valid answer received from the AI. Try rephrasing your question.",
            ],
          },
        ]);
        return;
      }

      let dataString = response.candidates[0].content.parts[0].text || "";
      dataString = dataString
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      setResult((prev) => [
        ...prev.slice(0, -1), // Remove the question added above
        { type: "q", text: [prompt] },
        {
          type: "a",
          text:
            dataString.length > 0
              ? dataString
              : ["Got an empty response. Try a different question."],
        },
      ]);
      setCurrentSuggestions(generateSuggestions(prompt));

      // Scroll to the new answer
      setTimeout(() => {
        if (scrollToAns.current) {
          scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
        }
      }, 500);
    } catch (err) {
      console.error("Fatal API request failed:", err);

      const is403Error =
        err.message.includes("Status 403") &&
        err.message.includes("unregistered callers");

      // Replace the question with a helpful error answer
      setResult((prev) => [
        ...prev.slice(0, -1), // Remove the question added above
        { type: "q", text: [prompt] },
        {
          type: "a",
          text: [
            is403Error
              ? `🚨 **API Error (403)**: The connection to the AI failed because the **API key is missing or invalid** in the request URL. This is an environment configuration issue.`
              : `🚨 AI Request Failed: ${err.message}. Please try again later.`,
          ],
        },
      ]);

      // Clear suggestions on error
      setCurrentSuggestions([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    // If a history item is clicked, trigger the question
    if (selectedHistory) {
      askQuestion(selectedHistory);
    }
  }, [selectedHistory]);

  const handleChange = (e) => {
    setQuestionInput(e.target.value);
  };

  const handleAsk = () => {
    if (questionInput.trim()) {
      const fullQuestion = fixedPrefix + questionInput.trim();
      askQuestion(fullQuestion);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuestionInput(suggestion);
    askQuestion(suggestion);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 min-h-screen bg-gray-50 font-sans">
      {/* ===== Sidebar (static) ===== */}
      <RecentSearch
        recentHistory={recentHistory}
        setSelectedHistory={setSelectedHistory}
        handleClearHistory={handleClearHistory}
        handleDeleteHistoryItem={handleDeleteHistoryItem}
      />

      {/* ===== Main Chat Area ===== */}
      <div className="col-span-4 flex flex-col h-screen">
        {/* Fixed Title Section */}
        <div className="sticky top-0 z-20 bg-gray-50 pt-7 pb-3 border-b border-green-100">
          <div className="space-y-1 text-center">
            <h2 className="text-center text-xl text-gray-700">
              <span className="font-extrabold text-green-700 text-3xl md:text-4xl tracking-wide font-inter">
                Plant
              </span>
              <span className="font-semibold text-gray-800 text-3xl md:text-4xl tracking-wide ml-2">
                Bot
              </span>
              <span className="inline-block ml-3 text-2xl md:text-3xl animate-bounce">
                🌿
              </span>
            </h2>
          </div>
        </div>

        {/* ===== Scrollable Section (between title & input) ===== */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 py-8 space-y-8">
          {/* Answer List Container - Increased min-height to 500px */}
          <div
            ref={scrollToAns}
            className="rounded-2xl bg-white shadow-2xl shadow-green-100/50 p-6 border-2 border-green-200/50 min-h-[500px]"
          >
            <ul className="space-y-8">
              {/* Welcome Message - Only shows if result array is empty */}
              {result.length === 0 && (
                <li className="flex flex-col items-start">
                  <div className="p-4 max-w-lg rounded-xl text-sm md:text-base bg-white text-gray-700 shadow-xl border border-gray-200">
                    <strong className="font-semibold text-green-700 text-lg">
                      👋 Welcome to Plant Bot!
                    </strong>
                    <p className="mt-2 text-gray-600">
                      I'm here to help you with your gardening questions. Try
                      asking about the care of a specific plant, like "monstera"
                      or "how often to water succulents."
                    </p>
                  </div>
                </li>
              )}

              {/* Map through existing Question/Answer results */}
              {result.map((item, index) => (
                <QuestionAnswer key={index} item={item} />
              ))}
            </ul>
          </div>

          {/* Suggestion Bar - Adjusted spacing/padding for clarity */}
          {currentSuggestions.length > 0 && !loader && (
            <div className="w-full max-w-2xl mx-auto flex flex-wrap gap-2 justify-center p-3 mt-4 border-t border-gray-100 pt-4">
              <span className="text-gray-600 text-sm font-semibold pr-1 pt-1 hidden sm:inline">
                Quick Questions:
              </span>
              {currentSuggestions.map((suggestion, index) => (
                <SuggestionButton
                  key={index}
                  text={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                />
              ))}
            </div>
          )}

          {/* Loader - Replaced complex SVG with clean, functional Tailwind spinner */}
          {loader && (
            <div
              role="status"
              className="flex justify-center items-center mt-6"
            >
              <div
                className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"
                aria-label="Loading response"
              ></div>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>

        {/* ===== Fixed Input Box ===== */}
        <div className="sticky bottom-0 z-20 bg-gray-50 pt-4 pb-6 border-t border-green-100">
          <div className="w-full max-w-2xl mx-auto flex items-center gap-3 bg-white border border-green-200 rounded-full shadow-2xl shadow-green-100/50 px-6 py-4">
            <span className="text-gray-700 whitespace-nowrap text-base md:text-lg hidden sm:inline">
              {fixedPrefix}
            </span>
            <span className="text-gray-700 whitespace-nowrap text-base md:text-lg sm:hidden">
              {fixedPrefix.split(" ")[0]}...
            </span>

            <input
              value={questionInput}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAsk();
              }}
              className="flex-1 text-black text-base md:text-lg bg-transparent focus:outline-none"
              type="text"
              placeholder="Enter about your plants........"
              disabled={loader}
            />

            <button
              onClick={handleAsk}
              className={`text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition px-5 py-2 rounded-full text-base font-semibold shadow-lg shadow-green-400/50 ${
                loader ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loader}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
