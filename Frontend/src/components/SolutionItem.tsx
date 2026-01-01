import React, { useState } from "react";
import { Avatar, Tooltip, Button as AntButton, message, Spin } from "antd";
import {
  UserOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
  OrderedListOutlined,
  UpOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { SolutionDto } from "../types/solution.types";
import { solutionService } from "../services/solution.service";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface SolutionItemProps {
  solution: SolutionDto;
  currentUserId?: string;
  isProblemAuthor: boolean;
  onAccept: (id: string) => void;
}

export const SolutionItem: React.FC<SolutionItemProps> = ({
  solution,
  currentUserId,
  isProblemAuthor,
  onAccept,
}) => {
  // State Vote
  const [voteCount, setVoteCount] = useState(solution.voteCount);
  const [userVote, setUserVote] = useState<number | null>(
    solution.currentUserVote ?? null
  );
  const [loadingVote, setLoadingVote] = useState(false);

  // State View Full Steps
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mở/đóng steps
  const [solutionSteps, setSolutionSteps] = useState<string[]>(
    solution.steps || []
  ); // Lưu các bước giải
  const [loadingSteps, setLoadingSteps] = useState(false); // Loading khi gọi API lấy steps

  // Xử lý Vote
  const handleVote = async (type: 1 | -1) => {
    if (!currentUserId) {
      message.warning("Please login to vote");
      return;
    }
    if (solution.userId === currentUserId) {
      message.warning("You cannot vote on your own solution");
      return;
    }

    try {
      setLoadingVote(true);
      const res = await solutionService.vote({
        solutionId: solution.id,
        voteType: type,
      });

      if (res.data.success && res.data.data) {
        setVoteCount(res.data.data.voteCount);
        if (userVote === type) {
          setUserVote(null);
        } else {
          setUserVote(type);
        }
      }
    } catch (error) {
      message.error("Failed to vote");
    } finally {
      setLoadingVote(false);
    }
  };

  // Xử lý Xem đầy đủ (Gọi API)
  const handleToggleViewFull = async () => {
    // Nếu đang mở thì đóng lại
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    // Nếu chưa có steps (hoặc muốn refresh), gọi API
    // Ở đây mình check: nếu mảng rỗng thì gọi API, nếu có rồi thì hiện luôn cho nhanh
    if (solutionSteps.length === 0) {
      try {
        setLoadingSteps(true);
        const res = await solutionService.getById(solution.id);

        if (res.data.success && res.data.data) {
          // Cập nhật steps từ API
          setSolutionSteps(res.data.data.steps || []);
          if (!res.data.data.steps || res.data.data.steps.length === 0) {
            message.info("This solution has no detailed steps.");
          } else {
            setIsExpanded(true);
          }
        }
      } catch (error) {
        message.error("Failed to load solution details");
      } finally {
        setLoadingSteps(false);
      }
    } else {
      // Đã có dữ liệu steps, chỉ cần mở ra
      setIsExpanded(true);
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all shadow-sm overflow-hidden flex flex-col ${
        solution.isAccepted
          ? "border-green-500/50 bg-gradient-to-br from-green-500/5 to-green-500/10"
          : "border-border bg-card hover:border-border/80"
      }`}
    >
      <div className="p-5 flex flex-col h-full">
        {/* --- HEADER (Avatar góc trên trái) --- */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              src={solution.userAvatar}
              icon={<UserOutlined />}
              className="bg-primary/20 text-primary border border-border/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${solution.userId}`}
                  className="text-sm font-bold text-primary hover:underline cursor-pointer"
                >
                  {solution.username}
                </Link>
                {solution.isAccepted && (
                  <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded border border-green-200 font-bold flex items-center gap-1">
                    <CheckCircleFilled /> Accepted
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(solution.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        </div>

        {/* --- BODY (Nội dung) --- */}
        <div className="pl-[52px] mb-2">
          <div className="prose prose-invert prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap break-words">
            {solution.content}
          </div>
        </div>

        {/* --- STEPS SECTION (Hiện ra khi bấm View Full) --- */}
        {loadingSteps && (
          <div className="pl-[52px] py-4">
            <Spin size="small" />{" "}
            <span className="text-sm text-muted-foreground ml-2">
              Loading steps...
            </span>
          </div>
        )}

        {isExpanded && solutionSteps.length > 0 && (
          <div className="ml-[52px] mt-4 mb-4 bg-background/50 border border-border/60 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <OrderedListOutlined />
              <h4 className="text-xs font-bold uppercase tracking-wider m-0">
                Detailed Steps
              </h4>
            </div>
            <ol className="list-decimal list-inside space-y-3 m-0">
              {solutionSteps.map((step, index) => (
                <li
                  key={index}
                  className="text-sm text-foreground/80 leading-relaxed pl-2 border-l-2 border-border/50 ml-1"
                >
                  <span className="ml-2">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* --- FOOTER & ACTIONS --- */}
        <div className="flex justify-between items-center mt-auto pt-2 pl-[52px]">
          {/* Nút View Full / Accept */}
          <div className="flex gap-4">
            {/* Nút View Full Solution */}
            <AntButton
              type="link"
              size="small"
              className="p-0 text-muted-foreground hover:text-primary flex items-center gap-1"
              onClick={handleToggleViewFull}
              loading={loadingSteps}
            >
              {isExpanded ? <UpOutlined /> : <EyeOutlined />}
              {isExpanded ? "Hide Steps" : "View Full Solution"}
            </AntButton>

            {/* Nút Accept (Cho tác giả) */}
            {isProblemAuthor && !solution.isAccepted && (
              <Tooltip title="Mark as accepted answer">
                <AntButton
                  type="text"
                  size="small"
                  onClick={() => onAccept(solution.id)}
                  className="text-muted-foreground hover:text-green-500 p-0 flex items-center gap-1"
                >
                  <CheckCircleOutlined /> Accept
                </AntButton>
              </Tooltip>
            )}
          </div>

          {/* Cụm Vote (Góc dưới phải) */}
          <div className="flex items-center gap-1">
            <Tooltip title={userVote === 1 ? "Remove like" : "Like"}>
              <AntButton
                type="text"
                size="small"
                icon={userVote === 1 ? <LikeFilled /> : <LikeOutlined />}
                onClick={() => handleVote(1)}
                disabled={loadingVote}
                className={
                  userVote === 1
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }
              >
                <span className="font-semibold ml-1">
                  {voteCount > 0 ? voteCount : "Like"}
                </span>
              </AntButton>
            </Tooltip>

            <span className="text-border mx-1">|</span>

            <Tooltip title={userVote === -1 ? "Remove dislike" : "Dislike"}>
              <AntButton
                type="text"
                size="small"
                icon={userVote === -1 ? <DislikeFilled /> : <DislikeOutlined />}
                onClick={() => handleVote(-1)}
                disabled={loadingVote}
                className={
                  userVote === -1
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-red-500"
                }
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
