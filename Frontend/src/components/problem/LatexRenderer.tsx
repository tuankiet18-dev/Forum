import React, { type JSX } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface LatexRendererProps {
  content: string;
  isPreview?: boolean; // Tùy chọn: nếu true thì xử lý nhẹ nhàng hơn cho card
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ content }) => {
  if (!content) return null;

  // Logic Parse LaTeX (Copy từ LatexPreview cũ của bạn)
  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let key = 0;

  // Match $$...$$ (block math)
  const blockRegex = /\$\$(.*?)\$\$/gs;
  let blockMatch;
  const blockMatches: { start: number; end: number; latex: string }[] = [];

  while ((blockMatch = blockRegex.exec(content)) !== null) {
    blockMatches.push({
      start: blockMatch.index,
      end: blockMatch.index + blockMatch[0].length,
      latex: blockMatch[1],
    });
  }

  // Match $...$ (inline math)
  const inlineRegex = /\$(.*?)\$/g;
  let inlineMatch;
  const inlineMatches: { start: number; end: number; latex: string }[] = [];

  while ((inlineMatch = inlineRegex.exec(content)) !== null) {
    const isInBlock = blockMatches.some(
      (bm) => inlineMatch!.index >= bm.start && inlineMatch!.index < bm.end
    );
    if (!isInBlock) {
      inlineMatches.push({
        start: inlineMatch.index,
        end: inlineMatch.index + inlineMatch[0].length,
        latex: inlineMatch[1],
      });
    }
  }

  const allMatches = [...blockMatches, ...inlineMatches].sort(
    (a, b) => a.start - b.start
  );

  allMatches.forEach((match) => {
    // Add text before match
    if (lastIndex < match.start) {
      parts.push(
        <span key={key++}>{content.substring(lastIndex, match.start)}</span>
      );
    }

    // Add LaTeX
    const isBlock = blockMatches.includes(match);
    try {
      parts.push(
        isBlock ? (
          // Trong Card, BlockMath có thể gây vỡ layout nếu không cẩn thận
          // Nhưng cứ render chuẩn trước
          <div key={key++} onClick={(e) => e.stopPropagation()} className="my-1">
             <BlockMath math={match.latex} />
          </div>
        ) : (
          <InlineMath key={key++} math={match.latex} />
        )
      );
    } catch (error) {
      parts.push(
        <span key={key++} className="text-red-500">
          {isBlock ? `$$${match.latex}$$` : `$${match.latex}$`}
        </span>
      );
    }

    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(<span key={key++}>{content.substring(lastIndex)}</span>);
  }

  return <>{parts.length > 0 ? parts : <span>{content}</span>}</>;
};