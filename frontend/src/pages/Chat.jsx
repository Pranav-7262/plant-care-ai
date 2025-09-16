import { useEffect, useRef, useState } from "react";
import { API_URL } from "../../ai-helper/constants";
import QuestionAnswer from "../../ai-components/QuestionAnswer";
import RecentSearch from "../../ai-components/RecentSearch";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    // --- Save question to history ---
    if (question) {
      let history = JSON.parse(localStorage.getItem("history")) || [];
      history = history.slice(0, 19);
      history = [question, ...history];
      history = history.map(
        (item) => item.charAt(0).toUpperCase() + item.slice(1).trim()
      );
      history = [...new Set(history)];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    }

    const payloadData = question ? question : selectedHistory;
    const payload = {
      contents: [{ parts: [{ text: payloadData }] }],
    };

    setLoader(true);

    try {
      let res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);

        let fallbackMsg =
          res.status === 429
            ? "⚠️ Too many requests. Please wait and try again."
            : "❌ Failed to fetch response from AI.";

        setResult((prev) => [
          ...prev,
          { type: "q", text: payloadData },
          { type: "a", text: [fallbackMsg] },
        ]);
        setLoader(false);
        setQuestion("");
        return;
      }

      let response = await res.json();

      if (!response.candidates || !response.candidates[0]) {
        console.error("Unexpected response:", response);
        setResult((prev) => [
          ...prev,
          { type: "q", text: payloadData },
          {
            type: "a",
            text: ["🤔 No valid answer received. Try again later."],
          },
        ]);
        setLoader(false);
        setQuestion("");
        return;
      }

      let dataString = response.candidates[0].content.parts[0].text || "";
      dataString = dataString.split("* ").map((item) => item.trim());

      setResult((prev) => [
        ...prev,
        { type: "q", text: payloadData },
        { type: "a", text: dataString },
      ]);

      setQuestion("");

      setTimeout(() => {
        if (scrollToAns.current) {
          scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
        }
      }, 500);
    } catch (err) {
      console.error("Fetch failed:", err);
      setResult((prev) => [
        ...prev,
        { type: "q", text: payloadData },
        { type: "a", text: ["🚨 Network error. Please try again."] },
      ]);
    } finally {
      setLoader(false);
    }
  };

  const isEnter = (event) => {
    if (event.key === "Enter") {
      askQuestion();
    }
  };

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  const fixedPrefix = "Can you share some plant information about ";

  const handleChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAsk = () => {
    if (question.trim()) {
      askQuestion(fixedPrefix + question.trim());
      setQuestion(fixedPrefix + question.trim());

      setQuestion(""); // Clear input after asking
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 min-h-screen bg-gray-50">
      {/* Sidebar */}
      <RecentSearch
        recentHistory={recentHistory}
        setRecentHistory={setRecentHistory}
        setSelectedHistory={setSelectedHistory}
      />

      {/* Main Chat Area */}
      <div className="col-span-4 p-6 md:p-12 flex flex-col gap-6">
        {/* Title */}
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-center mt-6 text-xl md:text-2xl font-normal text-gray-700">
            <span className="font-extrabold text-green-700 text-2xl md:text-3xl tracking-wide font-serif">
              Ask
            </span>{" "}
            anything about plants{" "}
            <span className="inline-block animate-bounce">🌿</span>
          </h2>
        </div>

        {/* Loader */}
        {loader && (
          <div role="status" className="flex justify-center my-4">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin fill-green-500"
              viewBox="0 0 100 101"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 
               77.6142 100.591 50 100.591C22.3858 100.591 
               0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 
               50 0.59082C77.6142 0.59082 100 22.9766 
               100 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 
               97.8624 35.9116 97.0079 33.5539C95.2932 
               28.8227 92.871 24.3692 89.8167 20.348C85.8452 
               15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
               4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 
               0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 
               1.69328 37.813 4.19778 38.4501 6.62326C39.0873 
               9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 
               9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 
               10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
               17.9648 79.3347 21.5619 82.5849 25.841C84.9175 
               28.9121 86.7997 32.2913 88.1811 35.8758C89.083 
               38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}

        {/* Answer List */}
        <div
          ref={scrollToAns}
          className="flex-1 overflow-y-auto rounded-xl bg-white shadow-md p-6 border border-gray-200 max-h-[450px]"
        >
          <ul className="space-y-5">
            {result.map((item, index) => (
              <QuestionAnswer key={index} item={item} index={index} />
            ))}
          </ul>
        </div>

        {/* Input Box */}

        <div className="w-full max-w-2xl mx-auto flex items-center gap-3 bg-white border border-gray-200 rounded-full shadow-sm px-5 py-3">
          <span className="text-gray-700 whitespace-nowrap text-base md:text-lg">
            {fixedPrefix}
          </span>

          <input
            value={question}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
            className="flex-1 text-black text-base md:text-lg bg-transparent focus:outline-none"
            type="text"
            placeholder="Enter plant name..."
          />

          <button
            onClick={handleAsk}
            className="text-white bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-full text-sm md:text-base font-semibold"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
