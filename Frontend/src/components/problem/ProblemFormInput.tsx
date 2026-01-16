import React from 'react';

interface ProblemFormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea';
  rows?: number;
  required?: boolean;
  helpText?: string;
}

export const ProblemFormInput: React.FC<ProblemFormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  rows = 4,
  required = false,
  helpText
}) => {
  const baseClasses = "w-full p-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground";
  
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea 
          placeholder={placeholder}
          className={`${baseClasses} resize-y leading-relaxed font-mono text-sm`}
          style={{ height: rows ? `${rows * 24}px` : 'auto' }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      ) : (
        <input 
          type="text"
          placeholder={placeholder}
          className={baseClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
      
      {helpText && (
        <p className="text-xs text-muted-foreground mt-1">{helpText}</p>
      )}
    </div>
  );
};