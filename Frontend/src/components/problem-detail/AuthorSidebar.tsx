import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Button } from "../ui/Button";
import { Link, useNavigate } from "react-router-dom"; 

interface AuthorSidebarProps {
  author: {
    userId: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
}

export const AuthorSidebar: React.FC<AuthorSidebarProps> = ({ author }) => {
  const navigate = useNavigate();
  const profileLink = `/profile/${author.userId}`;

  return (
    <div className="bg-card p-6 rounded-xl border border-border sticky top-24 shadow-sm">
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
        Asked by
      </div>
      <div className="flex items-center gap-4 mb-6">
        <Link to={profileLink}>
          <Avatar
            size={64}
            src={author.avatar}
            icon={<UserOutlined />}
            className="bg-primary/10 text-primary border-2 border-background shadow-sm hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
        <div>
          <Link to={profileLink} className="block font-bold text-primary text-lg leading-tight mb-1 hover:underline">
            {author.username}
          </Link>
          <div className="text-sm text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded inline-block">
            Reputation: <span className="font-bold text-foreground">{author.reputation}</span>
          </div>
        </div>
      </div>
      <Button className="w-full" variant="outline" onClick={() => navigate(profileLink)}>
        View Profile
      </Button>
    </div>
  );
};