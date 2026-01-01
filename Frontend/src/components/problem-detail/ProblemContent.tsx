import React from "react";
import { Tag } from "antd";
import { TagOutlined } from "@ant-design/icons";

interface ProblemContentProps {
  content: string;
  tags: string[];
}

export const ProblemContent: React.FC<ProblemContentProps> = ({ content, tags }) => {
  return (
    <>
      <div className="bg-card/30 p-6 md:p-8 rounded-2xl border border-border mb-8 shadow-sm">
        <div className="prose prose-invert prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {tags.map((tag) => (
          <Tag
            key={tag}
            className="bg-secondary text-secondary-foreground border-border px-3 py-1 text-sm m-0 flex items-center gap-1 rounded-md"
          >
            <TagOutlined /> {tag}
          </Tag>
        ))}
      </div>
    </>
  );
};