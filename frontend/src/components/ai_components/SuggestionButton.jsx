export const SuggestionButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition duration-200 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis"
    aria-label={`Ask about ${text}`}
  >
    {text}
  </button>
);
