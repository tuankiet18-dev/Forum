import React from "react";
import { SolutionItem } from "../SolutionItem"; // Import component cũ của bạn
import type { SolutionDto } from "../../types/solution.types";

interface SolutionListProps {
  solutions: SolutionDto[];
  currentUserId?: string;
  problemAuthorId: string;
  onAcceptSolution: (id: string) => void;
  onRefreshRequest: () => void;
}

export const SolutionList: React.FC<SolutionListProps> = ({
  solutions,
  currentUserId,
  problemAuthorId,
  onAcceptSolution,
  onRefreshRequest
}) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">{solutions.length} Solutions</h2>
        <div className="h-px bg-border flex-grow"></div>
      </div>

      <div className="space-y-6 mb-12">
        {solutions.length > 0 ? (
          solutions.map((sol) => (
            <SolutionItem
              key={sol.id}
              solution={sol}
              currentUserId={currentUserId}
              isProblemAuthor={currentUserId === problemAuthorId}
              onAccept={onAcceptSolution}
              onDataChange={onRefreshRequest}
            />
          ))
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card/20">
            <p className="text-muted-foreground italic mb-0">
              No solutions yet. Be the first to solve this!
            </p>
          </div>
        )}
      </div>
    </>
  );
};