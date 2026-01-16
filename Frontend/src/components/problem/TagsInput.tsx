import React, { useState, type KeyboardEvent } from 'react';
import { Tag } from 'antd';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  suggestions?: string[];
}

export const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  onChange,
  maxTags = 5,
  suggestions = []
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase().replace(/\s+/g, '-');
    
    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) return;
    if (tags.length >= maxTags) return;
    
    onChange([...tags, trimmedTag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestions
    .filter(s => !tags.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase()))
    .slice(0, 8);

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Tags (Optional)
      </label>
      
      {/* Display current tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Tag
            key={tag}
            closable
            onClose={() => handleRemoveTag(tag)}
            className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20"
          >
            {tag}
          </Tag>
        ))}
      </div>

      {/* Input */}
      {tags.length < maxTags && (
        <div className="relative">
          <input
            type="text"
            placeholder={`Add tags (${tags.length}/${maxTags}) - Press Enter to add`}
            className="w-full p-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredSuggestions.map(suggestion => (
                <div
                  key={suggestion}
                  className="px-4 py-2 hover:bg-secondary cursor-pointer text-sm"
                  onClick={() => handleAddTag(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        💡 Use hyphens for multi-word tags (e.g., quadratic-equations)
      </p>
    </div>
  );
};