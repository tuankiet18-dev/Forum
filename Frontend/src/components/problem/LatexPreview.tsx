// LatexPreview.tsx (Sau khi sửa)
import React from 'react';
import { LatexRenderer } from './LatexRenderer';

interface LatexPreviewProps {
  content: string;
  title?: string;
}

export const LatexPreview: React.FC<LatexPreviewProps> = ({ content, title }) => {
  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          <div className="h-px bg-border"></div>
        </div>
      )}
      
      <div className="prose prose-invert prose-lg max-w-none">
        <div className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
          <LatexRenderer content={content} />
        </div>
      </div>
    </div>
  );
};