import React from 'react';

/**
 * Safe inline Markdown renderer harmonized with the Velvet & Champagne design system.
 * Converts ***bold-italic***, **bold**, *italic*, and `pill` tokens into styled React
 * elements so raw asterisks (** **) or backticks never leak onto the screen.
 */
export function renderRichText(text: string): React.ReactNode {
  if (!text) return null;

  const tokenRegex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  if (parts.length === 1) return text;

  return parts.map((part, idx) => {
    if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
      return (
        <strong key={idx} className="font-semibold italic text-[#FDE68A]">
          {part.slice(3, -3)}
        </strong>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#FDE68A]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="font-display italic text-rose-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <span
          key={idx}
          className="rounded-md bg-white/10 px-1.5 py-0.5 text-[0.92em] font-medium text-[#E5C17B]"
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}
