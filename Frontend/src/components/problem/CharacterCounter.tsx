import React from 'react';
import { CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface CharacterCounterProps {
  current: number;
  min?: number;
  max?: number;
  label?: string;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  current,
  min = 0,
  max,
  label = 'characters'
}) => {
  const getStatus = () => {
    if (min && current < min) return 'error';
    if (max && current > max) return 'error';
    if (min && current >= min) return 'success';
    return 'normal';
  };

  const status = getStatus();
  
  const getColor = () => {
    switch (status) {
      case 'error': return 'text-red-500';
      case 'success': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'error': return <CloseCircleOutlined />;
      case 'success': return <CheckCircleOutlined />;
      default: return <WarningOutlined />;
    }
  };

  const getMessage = () => {
    if (min && current < min) {
      return `${min - current} more ${label} required`;
    }
    if (max && current > max) {
      return `${current - max} ${label} over limit`;
    }
    if (min && current >= min) {
      return 'Looking good!';
    }
    return '';
  };

  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${getColor()}`}>
      {status !== 'normal' && getIcon()}
      <span>
        {current} / {max || '∞'} {label}
      </span>
      {getMessage() && (
        <>
          <span>•</span>
          <span>{getMessage()}</span>
        </>
      )}
    </div>
  );
};