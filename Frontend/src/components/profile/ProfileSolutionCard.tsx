import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleFilled, LikeOutlined, ArrowRightOutlined } from "@ant-design/icons";
import type { SolutionDto } from "../../types/solution.types";

export const ProfileSolutionCard: React.FC<{ solution: SolutionDto }> = ({ solution }) => {
  return (
    <div className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all group">
      
      {/* Header Row: Title bên trái, Accepted bên phải */}
      <div className="flex justify-between items-start mb-3 gap-4">
        {/* Title Link moved here */}
        <Link 
          to={`/problems/${solution.problemId}`}
          className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2 leading-tight"
        >
           View Solution for Problem <ArrowRightOutlined className="text-sm opacity-50 -rotate-45 group-hover:rotate-0 transition-transform" />
        </Link>

        {/* Accepted Badge (nếu có) */}
        {solution.isAccepted && (
          // Thêm mt-1 để căn chỉnh đẹp hơn với text-lg của title, flex-shrink-0 để không bị co lại
          <span className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full border border-green-200 mt-1">
            <CheckCircleFilled /> Accepted
          </span>
        )}
      </div>

      <div className="mb-4">
        {/* Trích dẫn nội dung ngắn */}
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {solution.content}
        </p>
      </div>

      {/* Footer: Votes */}
      <div className="flex items-center gap-4 text-sm font-medium pt-3 border-t border-border/50">
        <div className={`flex items-center gap-1.5 ${solution.voteCount > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
          <LikeOutlined /> {solution.voteCount} Votes
        </div>
      </div>
    </div>
  );
};