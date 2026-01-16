import React, { useState } from "react";
import { Input, message, Space } from "antd";
import { Button } from "../ui/Button"; 
import { 
  PlusOutlined, 
  MinusCircleOutlined, 
  EditOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { UserProfile } from "../../types/auth.types";
// Import LatexEditor (đảm bảo đường dẫn đúng tới file bạn đã có)
import { LatexEditor } from "../problem/LatexEditor"; 

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
    if (content.trim().length < 10) {
      message.error("Solution content must be at least 10 characters long.");
      return;
    }
    await onSubmit(content, steps);
    setContent("");
    setSteps([""]);
    setIsExpanded(false);
  };

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

  if (!currentUser) {
    return (
      // ... Giữ nguyên phần chưa login ...
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
        <LatexEditor
          label="Solution Content"
          value={content}
          onChange={setContent}
          placeholder="Write your detailed solution here. Use LaTeX: $x^2 + y^2 = z^2$"
          required
          rows={8}
          showHelp={true}
          minChars={10}    
          maxChars={10000}
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
                {/* Các bước này vẫn dùng Input thường cho gọn, 
                    nhưng người dùng vẫn có thể gõ LaTeX (vd: $x$) và sẽ được render ở SolutionItem */}
                <Input
                    placeholder={`Step ${index + 1} (LaTeX supported: $...$)`}
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