import React, { useState } from "react";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  LinkOutlined,
  EditOutlined,
  CameraOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Upload, message } from "antd";
import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload";
import { authService } from "../../services/auth.service";
import type { UserProfile } from "../../types/auth.types";
import { Button } from "../ui/Button";
import { EditProfileModal } from "./EditProfileModal";

interface ProfileHeaderProps {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  stats: {
    problemsCount: number;
    solutionsCount: number;
    reputation: number;
  };
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  setUser,
  stats,
}) => {
  const [uploading, setUploading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Validate file
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) message.error("You can only upload JPG/PNG file!");
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) message.error("Image must smaller than 2MB!");
    return isJpgOrPng && isLt2M ? false : Upload.LIST_IGNORE;
  };

  // Handle Upload
  const handleAvatarChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFile>
  ) => {
    const fileObj = info.fileList[info.fileList.length - 1]?.originFileObj;
    if (fileObj) {
      try {
        setUploading(true);
        const newUrl = await authService.uploadAvatar(fileObj as File);
        setUser((prev) => (prev ? { ...prev, avatar: newUrl } : null));
        message.success("Avatar updated successfully!");
      } catch (error) {
        console.error(error);
        message.error("Failed to upload avatar.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUpdateSuccess = (newFullName: string) => {
    setUser((prev) => (prev ? { ...prev, fullName: newFullName } : null));
  };

  const joinedDate = user?.createdAt || "N/A";

  return (
    <aside className="space-y-8">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
        {/* Avatar Section */}
        <div className="mb-6 relative group w-[160px] h-[160px]">
          <Upload
            name="avatar"
            className="block w-full h-full cursor-pointer"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleAvatarChange}
            disabled={uploading}
          >
            <div className="w-[160px] h-[160px] rounded-full overflow-hidden border-4 border-background shadow-xl relative cursor-pointer">
              <Avatar
                size={152}
                src={user?.avatar}
                icon={!user?.avatar && <UserOutlined />}
                className="flex items-center justify-center bg-primary/10 text-primary text-6xl w-full h-full rounded-full object-cover"
              />
              {/* Overlay hover/loading */}
              <div
                className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-opacity duration-300 ${
                  uploading
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {uploading ? (
                  <LoadingOutlined className="text-2xl" />
                ) : (
                  <CameraOutlined className="text-2xl" />
                )}
                <span className="text-xs mt-1 font-medium">
                  {uploading ? "Uploading..." : "Change"}
                </span>
              </div>
            </div>
          </Upload>
        </div>

        {/* User Info */}
        <h1 className="text-3xl font-bold mb-1 tracking-tight text-foreground">
          {user?.fullName || user?.username}
        </h1>
        <p className="text-primary font-mono text-sm mb-4 bg-primary/5 px-2 py-1 rounded">
          @{user?.username}
        </p>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Passionate about high-level mathematics and algorithms. Contributing
          to the community with challenging problems.
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <EnvironmentOutlined />
            <span>Vietnam</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarOutlined />
            <span>Joined {joinedDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer mb-8 text-sm">
          <LinkOutlined />
          <span>mathforum.io</span>
        </div>

        {/* Nút Edit Profile */}
        <Button
          variant="outline"
          className="w-full mb-8 border-dashed"
          onClick={() => setIsEditModalOpen(true)}
        >
          <EditOutlined className="mr-2" /> Edit Profile
        </Button>

        {/* Thêm Modal vào cuối */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onUpdateSuccess={handleUpdateSuccess}
        />

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2 border-t border-border pt-6">
          <StatItem value={stats.problemsCount} label="Problems" />
          <StatItem value={stats.solutionsCount} label="Solutions" />
          <StatItem value={stats.reputation} label="Reputation" />
        </div>
      </div>
    </aside>
  );
};

const StatItem = ({ value, label }: { value: number; label: string }) => (
  <div className="text-center p-2 rounded hover:bg-card transition-colors">
    <div className="text-xl font-bold text-foreground">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
      {label}
    </div>
  </div>
);
