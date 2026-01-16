import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { RadioCardOption } from '../components/problem/RadioCardOption';
import { TagsInput } from '../components/problem/TagsInput';
import { GuidelinesBox } from '../components/problem/GuidelinesBox';
import { LatexEditor } from '../components/problem/LatexEditor';
import { CharacterCounter } from '../components/problem/CharacterCounter';
import { useUnsavedChangesWarning } from '../hooks/useUnsavedChangesWarning';
import { problemService } from '../services/problem.service';
import { SendOutlined, BookOutlined, BankOutlined } from '@ant-design/icons';
import { message, Select, Modal } from 'antd';
import { 
  CATEGORIES, 
  LEVELS, 
  DIFFICULTIES,
  PREDEFINED_TAGS 
} from '../constants/problem.constants';

interface FormData {
  title: string;
  content: string;
  category: string;
  difficulty: string;
  level: string;
  tags: string[];
}

const INITIAL_FORM_DATA: FormData = {
  title: '',
  content: '',
  category: 'Algebra',
  difficulty: 'Medium',
  level: 'Undergraduate',
  tags: []
};

export default function CreateProblemPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  
  // Check if user has made changes
  const hasUnsavedChanges = 
    formData.title.trim() !== '' || 
    formData.content.trim() !== '' ||
    formData.tags.length > 0 ||
    formData.category !== INITIAL_FORM_DATA.category ||
    formData.difficulty !== INITIAL_FORM_DATA.difficulty ||
    formData.level !== INITIAL_FORM_DATA.level;

  // Setup unsaved changes warning
  useUnsavedChangesWarning(hasUnsavedChanges);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      message.error("Please enter a title");
      return false;
    }
    
    if (formData.title.length < 10) {
      message.error("Title must be at least 10 characters");
      return false;
    }
    
    if (formData.title.length > 500) {
      message.error("Title must not exceed 500 characters");
      return false;
    }
    
    if (!formData.content.trim()) {
      message.error("Please enter problem content");
      return false;
    }
    
    if (formData.content.length < 20) {
      message.error("Content must be at least 20 characters");
      return false;
    }
    
    if (formData.content.length > 10000) {
      message.error("Content must not exceed 10,000 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      await problemService.create({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        level: formData.level,
        tags: formData.tags.length > 0 ? formData.tags : undefined
      });
      
      message.success("Problem created successfully!");
      
      // Reset form to prevent warning when navigating away
      setFormData(INITIAL_FORM_DATA);
      
      // Small delay to allow state update before navigation
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || "Failed to create problem");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Modal.confirm({
        title: 'Discard changes?',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        okText: 'Discard',
        okType: 'danger',
        cancelText: 'Keep editing',
        onOk: () => {
          navigate('/');
        }
      });
    } else {
      navigate('/');
    }
  };

  const tagSuggestions = PREDEFINED_TAGS[formData.category] || [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Problem</h1>
            <p className="text-muted-foreground text-lg">
              Share your mathematical challenge with the community
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              className="gap-2 px-8 font-semibold" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Posting..." : <><SendOutlined /> Post Problem</>}
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title with character counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  Problem Title <span className="text-red-500">*</span>
                </label>
                <CharacterCounter 
                  current={formData.title.length}
                  min={10}
                  max={500}
                />
              </div>
              <input 
                type="text" 
                placeholder="e.g., Find the roots of x³ - 6x² + 11x - 6 = 0"
                className="w-full p-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                maxLength={500}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                Category <span className="text-red-500">*</span>
              </label>
              <Select
                size="large"
                className="w-full"
                placeholder="Select a category"
                value={formData.category}
                onChange={(val) => handleChange('category', val)}
                options={CATEGORIES}
              />
            </div>

            {/* Content with LaTeX Preview */}
            <LatexEditor
              label="Problem Description"
              value={formData.content}
              onChange={(val) => handleChange('content', val)}
              placeholder="Describe the problem in detail. Use LaTeX for formulas: $x^2 + y^2 = z^2$"
              required
              minChars={20}
              maxChars={10000}
              rows={16}
              showHelp
            />

            {/* Tags */}
            <TagsInput
              tags={formData.tags}
              onChange={(tags) => handleChange('tags', tags)}
              maxTags={5}
              suggestions={tagSuggestions}
            />
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            
            {/* Level Selector */}
            <div className="p-5 rounded-xl border border-border bg-card/50">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 block items-center gap-2">
                <BankOutlined /> Education Level <span className="text-red-500">*</span>
              </label>
              <div className="space-y-1">
                {LEVELS.map(level => (
                  <RadioCardOption 
                    key={level.value}
                    value={level.value}
                    label={level.label}
                    description={level.description}
                    selectedValue={formData.level}
                    onChange={(val) => handleChange('level', val)}
                  />
                ))}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="p-5 rounded-xl border border-border bg-card/50">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 block items-center gap-2">
                <BookOutlined /> Difficulty <span className="text-red-500">*</span>
              </label>
              <div className="space-y-1">
                {DIFFICULTIES.map(diff => (
                  <RadioCardOption 
                    key={diff.value}
                    value={diff.value}
                    label={diff.label}
                    selectedValue={formData.difficulty}
                    onChange={(val) => handleChange('difficulty', val)}
                    colorClasses={diff}
                  />
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <GuidelinesBox />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}