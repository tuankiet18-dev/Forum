import React, { useState } from 'react';
import { Tabs, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { LatexPreview } from './LatexPreview';
import { CharacterCounter } from './CharacterCounter';

interface LatexEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  required?: boolean;
  minChars?: number;
  maxChars?: number;
  rows?: number;
  showHelp?: boolean;
}

export const LatexEditor: React.FC<LatexEditorProps> = ({
  value,
  onChange,
  placeholder,
  label,
  required = false,
  minChars = 0,
  maxChars,
  rows = 16,
  showHelp = false
}) => {
  const [activeTab, setActiveTab] = useState('edit');

  const latexHelp = [
    { syntax: '$x^2$', desc: 'Superscript' },
    { syntax: '$x_i$', desc: 'Subscript' },
    { syntax: '$\\frac{a}{b}$', desc: 'Fraction' },
    { syntax: '$\\sqrt{x}$', desc: 'Square root' },
    { syntax: '$\\sum_{i=1}^{n}$', desc: 'Summation' },
    { syntax: '$\\int_a^b$', desc: 'Integral' },
    { syntax: '$\\alpha, \\beta, \\gamma$', desc: 'Greek letters' },
  ];

  return (
    <div className="space-y-2">
      {/* Label with character counter */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
          {showHelp && (
            <Tooltip 
              title={
                <div className="space-y-2">
                  <div className="font-bold mb-2">LaTeX Quick Reference:</div>
                  {latexHelp.map((item, i) => (
                    <div key={i} className="flex justify-between gap-4 text-xs">
                      <code className="bg-black/30 px-2 py-0.5 rounded">{item.syntax}</code>
                      <span className="text-muted-foreground">{item.desc}</span>
                    </div>
                  ))}
                </div>
              }
              overlayStyle={{ maxWidth: '400px' }}
            >
              <QuestionCircleOutlined className="cursor-help text-muted-foreground hover:text-primary transition-colors" />
            </Tooltip>
          )}
        </label>
        
        <CharacterCounter 
          current={value.length}
          min={minChars}
          max={maxChars}
        />
      </div>

      {/* Tabs: Edit / Preview */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'edit',
            label: (
              <span className="flex items-center gap-2">
                <EditOutlined /> Edit
              </span>
            ),
            children: (
              <textarea
                placeholder={placeholder}
                className="w-full p-4 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y leading-relaxed text-foreground font-mono text-sm"
                style={{ height: `${rows * 24}px`, minHeight: '200px' }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
              />
            ),
          },
          {
            key: 'preview',
            label: (
              <span className="flex items-center gap-2">
                <EyeOutlined /> Preview
              </span>
            ),
            children: (
              <div 
                className="p-6 rounded-lg bg-card border border-border min-h-[200px]"
                style={{ minHeight: `${rows * 24}px` }}
              >
                {value ? (
                  <LatexPreview content={value} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground italic">
                    No content to preview
                  </div>
                )}
              </div>
            ),
          },
        ]}
        className="latex-editor-tabs"
      />

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        💡 Use <code className="bg-secondary px-1 rounded">$...$</code> for inline math and{' '}
        <code className="bg-secondary px-1 rounded">$$...$$</code> for display math
      </p>
    </div>
  );
};