import React from "react";
import { Card } from "./ui/Card";
import { UserOutlined, CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import type { Problem } from "../types/problem.types";
import { Link } from "react-router-dom";
import { LatexRenderer } from "./problem/LatexRenderer"; // Import component mới

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-600 border-red-500/20",
};

export const ProblemCard: React.FC<{ problem: Problem }> = ({ problem }) => {
  const difficulty = (problem.difficulty?.toLowerCase() || "medium");
  const badgeClass = difficultyColors[difficulty] || difficultyColors["medium"];

  return (
    <Link to={`/problems/${problem.id}`} className="block h-full group">
        <Card className="p-6 flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-3">
            {/* Title: Sử dụng LatexRenderer */}
            <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
               <LatexRenderer content={problem.title} />
            </h3>
            
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass} capitalize whitespace-nowrap flex-shrink-0`}>
               {difficulty}
            </span>
        </div>

        {/* Content Preview: Sử dụng LatexRenderer */}
        {/* Lưu ý: Dùng div thay vì p để tránh lỗi HTML lồng nhau nếu có block math */}
        <div className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2 overflow-hidden text-ellipsis">
            <LatexRenderer content={problem.content} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
                <UserOutlined />
                <span>{problem.username}</span> 
            </div>
            <div className="flex items-center gap-1.5">
                <CheckCircleOutlined />
                <span>{problem.solutionCount} solutions</span>
            </div>
             <div className="flex items-center gap-1.5">
                <EyeOutlined />
                <span>{problem.viewCount} views</span>
            </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
            {problem.tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                {tag}
                </span>
            ))}
            </div>
        </div>
        </Card>
    </Link>
  );
};