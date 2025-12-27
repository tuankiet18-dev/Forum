import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Tabs, message } from "antd"; // KHÔNG import Button từ antd
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { authService } from "../../services/auth.service";
import type { UserProfile } from "../../types/auth.types";
import { Button } from "../ui/Button"; // Import Button Custom của dự án

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdateSuccess: (newFullName: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, onClose, user, onUpdateSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [formProfile] = Form.useForm();
  const [formPassword] = Form.useForm();

  useEffect(() => {
    if (isOpen && user) {
      formProfile.setFieldsValue({ fullName: user.fullName });
    }
  }, [isOpen, user, formProfile]);

  const handleUpdateProfile = async (values: { fullName: string }) => {
    setLoading(true);
    try {
      const res = await authService.updateProfile(values);
      if (res.data.success) {
        message.success("Profile updated successfully!");
        onUpdateSuccess(values.fullName);
        onClose();
      } else {
        message.error(res.data.message || "Update failed");
      }
    } catch (error) {
      message.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    setLoading(true);
    try {
      const res = await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword
      });
      
      if (res.data.success) {
        message.success("Password changed successfully!");
        formPassword.resetFields();
        onClose();
      } else {
        message.error(res.data.message || "Change password failed");
      }
    } catch (error: any) {
        const msg = error.response?.data?.message || "An error occurred";
        message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: '1',
      label: <span><UserOutlined /> General Info</span>,
      children: (
        <Form form={formProfile} layout="vertical" onFinish={handleUpdateProfile} className="mt-4">
          <Form.Item 
            label="Full Name" 
            name="fullName"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input placeholder="Enter your full name" size="large" className="rounded-md" />
          </Form.Item>
          
          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      ),
    },
    {
      key: '2',
      label: <span><LockOutlined /> Security</span>,
      children: (
        <Form form={formPassword} layout="vertical" onFinish={handleChangePassword} className="mt-4">
          <Form.Item 
            label="Current Password" 
            name="currentPassword"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input.Password placeholder="Enter current password" size="large" className="rounded-md" />
          </Form.Item>
          <Form.Item 
            label="New Password" 
            name="newPassword"
            rules={[{ required: true, message: 'Required' }, { min: 6, message: 'Min 6 chars' }]}
          >
            <Input.Password placeholder="Enter new password" size="large" className="rounded-md" />
          </Form.Item>
          <Form.Item 
            label="Confirm New Password" 
            name="confirmNewPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Required' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" size="large" className="rounded-md" />
          </Form.Item>
          
          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            {/* Dùng variant="destructive" cho nút đổi pass (màu đỏ) */}
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? "Processing..." : "Change Password"}
            </Button>
          </div>
        </Form>
      ),
    },
  ];

  return (
    <Modal 
      title={<span className="text-lg font-bold">Edit Profile</span>}
      open={isOpen} 
      onCancel={onClose} 
      footer={null} 
      centered
      width={500}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
};