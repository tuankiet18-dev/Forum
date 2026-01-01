import React from "react";
import { 
  ClockCircleOutlined, EyeOutlined, MessageOutlined 
} from "@ant-design/icons";
import type { ProblemDetailDto } from "../../types/problem.types";

interface ProblemHeaderProps {
  problem: ProblemDetailDto;
}

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({ problem }) => {
  return (
    <div className="mb-8 border-b border-border pb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-balance flex-1">
          {problem.title}
        </h1>
        <span
          className={`px-4 py-1.5 rounded-full border text-sm font-bold uppercase tracking-wider ${
            problem.difficulty === "Hard"
              ? "border-red-500/20 bg-red-500/10 text-red-500"
              : problem.difficulty === "Medium"
              ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
              : "border-green-500/20 bg-green-500/10 text-green-500"
          }`}
        >
          {problem.difficulty}
        </span>
      </div>
      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <ClockCircleOutlined /> Posted {new Date(problem.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-2">
          <EyeOutlined /> {problem.viewCount} views
        </span>
        <span className="flex items-center gap-2">
          <MessageOutlined /> {problem.solutions.length} solutions
        </span>
        <span className="flex items-center gap-2">
          Category: <span className="font-semibold text-foreground">{problem.category}</span>
        </span>
      </div>
    </div>
  );
};