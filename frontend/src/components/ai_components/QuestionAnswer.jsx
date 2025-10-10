export const QuestionAnswer = ({ item }) => {
  const isQuestion = item.type === "q";

  const roleClass = isQuestion
    ? "bg-green-600 text-white self-end rounded-br-none shadow-lg shadow-green-300/50"
    : "bg-white text-gray-800 self-start rounded-tl-none border border-gray-100 shadow-xl shadow-gray-200/50";

  const icon = isQuestion ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-white"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a1.5 1.5 0 0 0 1.41 1.082h13.784a1.5 1.5 0 0 0 1.409-1.082L21 16.5V13.5A2.25 2.25 0 0 0 18.75 11.25H5.25A2.25 2.25 0 0 0 3 13.5v3z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-green-700"
    >
      <path
        fillRule="evenodd"
        d="M9 2.25a.75.75 0 0 1 .75.75v1.5.75A.75.75 0 0 1 9 6h-.75a.75.75 0 0 1-.75-.75V4.5A.75.75 0 0 1 7.5 4.5V3a.75.75 0 0 1 1.5 0v-.75ZM9 9a.75.75 0 0 1 .75.75v3c0 .414-.336.75-.75.75a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75ZM7.5 15a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5H8.25a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 18ZM3.75 4.5A.75.75 0 0 1 4.5 3h15a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V4.5Z"
        clipRule="evenodd"
      />
    </svg>
  );

  const formatText = (text) => {
    return text.split("**").map((segment, index) => {
      if (index % 2 !== 0) {
        return (
          <strong key={index} className="text-green-700 font-extrabold">
            {segment}
          </strong>
        );
      }
      return segment;
    });
  };

  const renderContentBlocks = (blocks) => {
    if (item.type !== "a") {
      return blocks.map((line, i) => (
        <p key={i} className="mb-1 last:mb-0">
          {formatText(line)}
        </p>
      ));
    }

    return blocks.map((block, index) => {
      const lines = block.split("\n").filter((line) => line.trim().length > 0);
      const listMarkers = ["* ", "- "];
      const isListBlock =
        lines.filter(
          (line) =>
            listMarkers.some((marker) => line.startsWith(marker)) ||
            line.match(/^\d+\.\s/)
        ).length >= Math.min(2, lines.length);

      if (isListBlock) {
        const isOrdered = lines.some((line) => line.match(/^\d+\.\s/));
        const ListTag = isOrdered ? "ol" : "ul";
        const listStyle = isOrdered ? "list-decimal" : "list-disc";

        return (
          <ListTag
            key={index}
            className={`${listStyle} list-inside space-y-1 pl-4 mb-3 text-gray-700`}
          >
            {lines.map((line, i) => {
              const content = line.replace(/^[\*\-\d+\.]+\s*/, "");
              return (
                <li key={i} className="pl-1">
                  {formatText(content)}
                </li>
              );
            })}
          </ListTag>
        );
      }

      const isFirstAIParagraph = index === 0;

      let paragraphClass = "mb-2 last:mb-0 text-gray-800";
      if (isFirstAIParagraph) {
        paragraphClass =
          "text-md md:text-lg font-bold text-green-800 mb-3 mt-1";
      }

      return (
        <p key={index} className={paragraphClass}>
          {formatText(block)}
        </p>
      );
    });
  };

  return (
    <li className={`flex flex-col ${isQuestion ? "items-end" : "items-start"}`}>
      <div
        className={`p-4 max-w-lg md:max-w-xl rounded-xl text-sm md:text-base transition-all duration-300 ${roleClass}`}
      >
        <div className="flex items-start gap-2 mb-2">
          {icon}
          <strong className="font-semibold text-sm">
            {isQuestion ? "You" : "Plant Bot"}
          </strong>
        </div>
        <div className="break-words">{renderContentBlocks(item.text)}</div>
      </div>
    </li>
  );
};
