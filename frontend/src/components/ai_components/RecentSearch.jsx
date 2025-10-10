export const RecentSearch = ({
  recentHistory,
  setSelectedHistory,
  handleClearHistory,
  handleDeleteHistoryItem,
}) => {
  const handleSelect = (text) => {
    setSelectedHistory(text);
  };

  return (
    <div className="col-span-1 p-6 bg-white border-r border-gray-100 shadow-lg hidden md:flex flex-col">
      {/* Header */}
      <h3 className="text-xl font-bold text-gray-700 mb-5 border-b-2 border-green-100 pb-3 flex justify-between items-center">
        Recent Searches
        {recentHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-xs text-red-500 hover:text-red-700 transition duration-200 p-1 rounded hover:bg-red-50"
            title="Clear all saved history"
          >
            Clear All
          </button>
        )}
      </h3>

      {/* Scrollable area */}
      <div className="overflow-y-auto space-y-3" style={{ maxHeight: "60vh" }}>
        {recentHistory.length === 0 ? (
          <p className="text-gray-500 text-sm italic p-2">No recent history.</p>
        ) : (
          recentHistory.map((item) => (
            <div
              key={item.id}
              className="w-full flex justify-between items-center rounded-lg bg-white transition duration-200 text-gray-700 text-sm border border-gray-200 shadow-md overflow-hidden"
            >
              <button
                onClick={() => handleSelect(item.query)}
                className="flex-1 text-left p-3 hover:bg-green-50 transition duration-200 truncate"
              >
                {item.query}
              </button>
              <button
                onClick={() => handleDeleteHistoryItem(item.id)}
                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 transition duration-200 border-l border-gray-200 flex-shrink-0"
                title={`Delete history for: ${item.query}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
