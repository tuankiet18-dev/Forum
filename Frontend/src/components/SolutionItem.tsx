import React, { useState } from "react";
import { Avatar, Tooltip, Button as AntButton, message, Spin, Dropdown, Modal, type MenuProps } from "antd";
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
  MoreOutlined,       // Icon 3 chấm
  EditOutlined,       // Icon sửa
  DeleteOutlined,     // Icon xóa
  ExclamationCircleOutlined
} from "@ant-design/icons";
import type { SolutionDto } from "../types/solution.types";
import { solutionService } from "../services/solution.service";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { LatexRenderer } from "./problem/LatexRenderer"; // Đảm bảo đường dẫn đúng
import { LatexEditor } from "./problem/LatexEditor";     // Import Editor để sửa bài

interface SolutionItemProps {
  solution: SolutionDto;
  currentUserId?: string;
  isProblemAuthor: boolean;
  onAccept: (id: string) => void;
  // Callback để báo cho component cha biết cần reload data
  onDataChange?: () => void; 
}

export const SolutionItem: React.FC<SolutionItemProps> = ({
  solution,
  currentUserId,
  isProblemAuthor,
  onAccept,
  onDataChange
}) => {
  // State Vote
  const [voteCount, setVoteCount] = useState(solution.voteCount);
  const [userVote, setUserVote] = useState<number | null>(solution.currentUserVote ?? null);
  const [loadingVote, setLoadingVote] = useState(false);

  // State View Steps
  const [isExpanded, setIsExpanded] = useState(false);
  const [solutionSteps, setSolutionSteps] = useState<string[]>(solution.steps || []);
  const [loadingSteps, setLoadingSteps] = useState(false);

  // --- STATE EDITING ---
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(solution.content);
  const [isSaving, setIsSaving] = useState(false);

  // Logic Vote (Giữ nguyên)
  const handleVote = async (type: 1 | -1) => {
    if (!currentUserId) { message.warning("Please login to vote"); return; }
    if (solution.userId === currentUserId) { message.warning("You cannot vote on your own solution"); return; }
    try {
      setLoadingVote(true);
      const res = await solutionService.vote({ solutionId: solution.id, voteType: type });
      if (res.data.success && res.data.data) {
        setVoteCount(res.data.data.voteCount);
        setUserVote(userVote === type ? null : type);
      }
    } catch (error) { message.error("Failed to vote"); } finally { setLoadingVote(false); }
  };

  // Logic Toggle Steps (Giữ nguyên)
  const handleToggleViewFull = async () => {
    if (isExpanded) { setIsExpanded(false); return; }
    if (solutionSteps.length === 0) {
      try {
        setLoadingSteps(true);
        const res = await solutionService.getById(solution.id);
        if (res.data.success && res.data.data) {
          setSolutionSteps(res.data.data.steps || []);
          setIsExpanded(true);
        }
      } catch (error) { message.error("Failed to load details"); } finally { setLoadingSteps(false); }
    } else { setIsExpanded(true); }
  };

  // --- XỬ LÝ SỬA (EDIT) ---
  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
        message.error("Content cannot be empty");
        return;
    }
    try {
        setIsSaving(true);
        const res = await solutionService.update(solution.id, { 
            content: editContent,
            steps: solutionSteps // Hiện tại API update có thể yêu cầu gửi cả steps
        });
        
        if (res.data.success) {
            message.success("Solution updated successfully");
            setIsEditing(false);
            if (onDataChange) onDataChange(); // Refresh lại dữ liệu từ cha
        }
    } catch (error) {
        message.error("Failed to update solution");
    } finally {
        setIsSaving(false);
    }
  };

  // --- XỬ LÝ XÓA (DELETE) ---
  const handleDelete = () => {
    Modal.confirm({
        title: 'Delete this solution?',
        icon: <ExclamationCircleOutlined />,
        content: 'This action cannot be undone. Are you sure?',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
            try {
                await solutionService.remove(solution.id);
                message.success("Solution deleted");
                if (onDataChange) onDataChange(); // Refresh lại dữ liệu từ cha
            } catch (error) {
                message.error("Failed to delete solution");
            }
        },
    });
  };

  // Menu Dropdown Items
  const menuItems: MenuProps['items'] = [
    {
        key: 'edit',
        label: 'Edit Solution',
        icon: <EditOutlined />,
        onClick: () => {
            setEditContent(solution.content);
            setIsEditing(true);
        }
    },
    {
        key: 'delete',
        label: 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: handleDelete
    }
  ];

  return (
    <div className={`rounded-xl border transition-all shadow-sm overflow-hidden flex flex-col ${
        solution.isAccepted
          ? "border-green-500/50 bg-gradient-to-br from-green-500/5 to-green-500/10"
          : "border-border bg-card hover:border-border/80"
      }`}
    >
      <div className="p-5 flex flex-col h-full">
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar size={40} src={solution.userAvatar} icon={<UserOutlined />} className="bg-primary/20 text-primary border border-border/50" />
            <div>
              <div className="flex items-center gap-2">
                <Link to={`/profile/${solution.userId}`} className="text-sm font-bold text-primary hover:underline cursor-pointer">
                  {solution.username}
                </Link>
                {solution.isAccepted && (
                  <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded border border-green-200 font-bold flex items-center gap-1">
                    <CheckCircleFilled /> Accepted
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(solution.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>

          {/* --- MENU 3 CHẤM (Chỉ hiện nếu là chủ sở hữu và không đang edit) --- */}
          {currentUserId === solution.userId && !isEditing && (
             <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                <AntButton type="text" shape="circle" icon={<MoreOutlined className="text-lg text-muted-foreground" />} />
             </Dropdown>
          )}
        </div>

        {/* --- BODY (Hiển thị hoặc Form Sửa) --- */}
        <div className="pl-[52px] mb-2">
          {isEditing ? (
             // FORM SỬA: Dùng lại LatexEditor
             <div className="animate-in fade-in zoom-in-95 duration-200">
                <LatexEditor 
                    label="Edit Content" 
                    value={editContent} 
                    onChange={setEditContent} 
                    rows={6}
                    minChars={10}
                    maxChars={10000}
                />
                <div className="flex justify-end gap-2 mt-3">
                    <AntButton size="small" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</AntButton>
                    <AntButton type="primary" size="small" onClick={handleSaveEdit} loading={isSaving}>Save Changes</AntButton>
                </div>
             </div>
          ) : (
             // HIỂN THỊ: Dùng LatexRenderer
             <div className="prose prose-invert prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap break-words">
                <LatexRenderer content={solution.content} />
             </div>
          )}
        </div>

        {/* --- STEPS & FOOTER (Chỉ hiện khi không Edit) --- */}
        {!isEditing && (
          <>
            {loadingSteps && <div className="pl-[52px] py-4"><Spin size="small" /> <span className="text-sm text-muted-foreground ml-2">Loading steps...</span></div>}
            
            {isExpanded && solutionSteps.length > 0 && (
              <div className="ml-[52px] mt-4 mb-4 bg-background/50 border border-border/60 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <OrderedListOutlined />
                  <h4 className="text-xs font-bold uppercase tracking-wider m-0">Detailed Steps</h4>
                </div>
                <ol className="list-decimal list-inside space-y-3 m-0">
                  {solutionSteps.map((step, index) => (
                    <li key={index} className="text-sm text-foreground/80 leading-relaxed pl-2 border-l-2 border-border/50 ml-1">
                      <span className="ml-2"><LatexRenderer content={step} /></span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex justify-between items-center mt-auto pt-2 pl-[52px]">
                 <div className="flex gap-4">
                    <AntButton type="link" size="small" className="p-0 text-muted-foreground hover:text-primary flex items-center gap-1" onClick={handleToggleViewFull} loading={loadingSteps}>
                        {isExpanded ? <UpOutlined /> : <EyeOutlined />} {isExpanded ? "Hide Steps" : "View Full Solution"}
                    </AntButton>
                    {isProblemAuthor && !solution.isAccepted && (
                       <Tooltip title="Mark as accepted answer">
                         <AntButton type="text" size="small" onClick={() => onAccept(solution.id)} className="text-muted-foreground hover:text-green-500 p-0 flex items-center gap-1">
                           <CheckCircleOutlined /> Accept
                         </AntButton>
                       </Tooltip>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <Tooltip title={userVote === 1 ? "Remove like" : "Like"}>
                      <AntButton type="text" size="small" icon={userVote === 1 ? <LikeFilled /> : <LikeOutlined />} onClick={() => handleVote(1)} disabled={loadingVote} className={userVote === 1 ? "text-primary" : "text-muted-foreground hover:text-primary"}>
                        <span className="font-semibold ml-1">{voteCount > 0 ? voteCount : "Like"}</span>
                      </AntButton>
                    </Tooltip>
                    <span className="text-border mx-1">|</span>
                    <Tooltip title={userVote === -1 ? "Remove dislike" : "Dislike"}>
                      <AntButton type="text" size="small" icon={userVote === -1 ? <DislikeFilled /> : <DislikeOutlined />} onClick={() => handleVote(-1)} disabled={loadingVote} className={userVote === -1 ? "text-red-500" : "text-muted-foreground hover:text-red-500"} />
                    </Tooltip>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};