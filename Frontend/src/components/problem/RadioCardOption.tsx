import React from 'react';

interface RadioCardOptionProps {
  value: string;
  label: string;
  description?: string;
  selectedValue: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  colorClasses?: {
    color: string;
    bgColor: string;
    borderColor: string;
  };
}

export const RadioCardOption: React.FC<RadioCardOptionProps> = ({
  value,
  label,
  description,
  selectedValue,
  onChange,
  icon,
  colorClasses
}) => {
  const isSelected = selectedValue === value;
  
  return (
    <div 
      onClick={() => onChange(value)}
      className={`
        cursor-pointer p-3 rounded-lg border transition-all duration-200 mb-2
        ${isSelected 
          ? colorClasses
            ? `${colorClasses.borderColor} ${colorClasses.bgColor} ${colorClasses.color} ring-1`
            : 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
          : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isSelected ? 'border-primary' : 'border-muted-foreground'
        }`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-sm">{label}</span>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};