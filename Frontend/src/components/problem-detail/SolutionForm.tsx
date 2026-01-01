import React, { useState } from "react";
import { Input, Space } from "antd";
import { Button } from "../ui/Button"; // Custom Button
import { 
  PlusOutlined, 
  MinusCircleOutlined, 
  EditOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { UserProfile } from "../../types/auth.types";

const { TextArea } = Input;

interface SolutionFormProps {
  currentUser: UserProfile | null;
  onSubmit: (content: string, steps: string[]) => Promise<void>;
  submitting: boolean;
}

export const SolutionForm: React.FC<SolutionFormProps> = ({
  currentUser,
  onSubmit,
  submitting,
}) => {
  // State quản lý việc ẩn/hiện form
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [content, setContent] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);

  const handleAddStep = () => setSteps([...steps, ""]);
  const handleRemoveStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = async () => {
    await onSubmit(content, steps);
    // Reset form và đóng lại sau khi submit thành công
    setContent("");
    setSteps([""]);
    setIsExpanded(false);
  };

  // --- TRẠNG THÁI 1: FORM ĐANG ĐÓNG (Chỉ hiện nút bấm) ---
  if (!isExpanded) {
    return (
      <div className="mt-8 mb-12">
        <Button 
          onClick={() => setIsExpanded(true)}
          className="w-full h-14 text-base font-semibold border-2 border-dashed border-border bg-card/50 hover:bg-card hover:border-primary text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2"
          variant="ghost"
        >
          <EditOutlined /> Write a Solution
        </Button>
      </div>
    );
  }

  // --- TRẠNG THÁI 2: FORM MỞ NHƯNG CHƯA LOGIN ---
  if (!currentUser) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-8 mb-12 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Your Solution</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}><CloseOutlined /></Button>
        </div>
        <div className="p-8 bg-secondary/20 rounded-lg text-center border border-dashed border-border">
          <p className="mb-4 text-muted-foreground text-lg">
            Please login to join the discussion.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setIsExpanded(false)}>Cancel</Button>
            <Link to="/login">
                <Button>Login to Post</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- TRẠNG THÁI 3: FORM MỞ VÀ ĐÃ LOGIN (Nhập liệu) ---
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-8 mb-12 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
            <EditOutlined className="text-primary" /> Your Solution
        </h3>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(false)}
            className="text-muted-foreground hover:text-red-500"
        >
            <CloseOutlined /> Close
        </Button>
      </div>
      
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2 text-muted-foreground">
          Solution Content <span className="text-red-500">*</span>
        </label>
        <TextArea
          className="w-full p-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y text-foreground placeholder:text-muted-foreground/50"
          placeholder="Write your detailed solution here. Markdown and LaTeX are supported..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-muted-foreground">
          Step-by-step Explanation (Optional)
        </label>
        <div className="bg-secondary/10 p-4 rounded-lg border border-border/50">
            <Space direction="vertical" className="w-full" size="middle">
            {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                <Input
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    className="flex-1 h-10"
                />
                {steps.length > 1 && (
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStep(index)}
                    className="text-muted-foreground hover:text-red-500 h-10 w-10"
                    >
                    <MinusCircleOutlined />
                    </Button>
                )}
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddStep} className="w-full border-dashed">
                <PlusOutlined /> Add Another Step
            </Button>
            </Space>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={() => setIsExpanded(false)} disabled={submitting}>
            Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={submitting} className="px-8 font-semibold min-w-[140px]">
          {submitting ? "Posting..." : "Post Solution"}
        </Button>
      </div>
    </div>
  );
};