'use strict';

// Custom rule: Require blank line before and after tables
// Mirrors check-md-conformance.js behavior for table spacing.
// Usage with markdownlint-cli:
//   npx markdownlint "docs/**/*.md" --config .patch/830/.markdownlint.json --rules .patch/830/markdownlint-rules/table-blank-lines.js

module.exports = {
  names: ["BMAD_TABLE_BLANK_LINES"],
  description: "Tables must be surrounded by blank lines (before and after)",
  tags: ["table", "blank_lines"],
  function: function rule(params, onError) {
    const lines = params.lines; // array of lines
    const tokens = params.tokens || []; // markdown-it tokens

    // Find table_open and table_close tokens
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.type === "table_open") {
        const openLine = t.lineNumber; // 1-based

        // Determine the close line by scanning forward to table_close
        let closeLine = openLine;
        for (let j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type === "table_close") {
            closeLine = tokens[j].lineNumber;
            break;
          }
        }

        // Check blank line BEFORE table (line before openLine)
        const beforeIndex = openLine - 2; // convert to 0-based index of previous line
        if (beforeIndex >= 0) {
          const beforeLine = lines[beforeIndex] || "";
          if (beforeLine.trim() !== "") {
            onError({
              lineNumber: openLine,
              detail: "Missing blank line before table",
            });
          }
        }

        // Check blank line AFTER table (line after closeLine)
        const afterIndex = closeLine; // 0-based index of next line
        if (afterIndex < lines.length) {
          const afterLine = lines[afterIndex] || "";
          if (afterLine.trim() !== "") {
            onError({
              lineNumber: closeLine,
              detail: "Missing blank line after table",
            });
          }
        }
      }
    }
  }
};
