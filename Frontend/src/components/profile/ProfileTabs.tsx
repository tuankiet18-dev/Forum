import React from "react";
import { Tabs } from "antd";
import { FileTextOutlined, MessageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ProblemCard } from "../ProblemCard";
import { Button } from "../ui/Button"; // Custom Button
import type { Problem } from "../../types/problem.types";

interface ProfileTabsProps {
  problems: Problem[];
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ problems }) => {
  const navigate = useNavigate();

  const items = [
    {
      key: 'problems',
      label: <span className="flex items-center gap-2 px-2"><FileTextOutlined /> Problems</span>,
      children: (
        <div className="mt-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {problems.length > 0 ? (
            <>
              {problems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary mt-4">
                View all history
              </Button>
            </>
          ) : (
            // Empty State giống hệt ảnh
            <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card/20 min-h-[300px] flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-4">You haven't posted any problems yet.</p>
              <Button 
                variant="default" // Nút màu xanh đậm
                onClick={() => navigate("/problems/create")}
              >
                Create your first problem
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'solutions',
      label: <span className="flex items-center gap-2 px-2"><MessageOutlined /> Solutions</span>,
      children: (
        <div className="mt-4 text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/20">
          <p className="text-muted-foreground">Activity feed for solutions will appear here.</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-w-0">
      <Tabs defaultActiveKey="problems" size="large" className="custom-tabs" items={items} />
    </div>
  );
};