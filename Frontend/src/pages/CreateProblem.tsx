import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { problemService } from '../services/problem.service';
import { 
  EyeOutlined, 
  SendOutlined, 
  InfoCircleOutlined, 
  QuestionCircleOutlined 
} from '@ant-design/icons';
import { message } from 'antd'; // Dùng message của Antd cho đẹp

export default function CreateProblemPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // State form
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Algebra', // Mặc định hoặc thêm dropdown nếu cần
        difficulty: 'Medium', // Mặc định là Medium giống ảnh
        tags: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Simple Validation
        if (!formData.title.trim() || !formData.content.trim()) {
            message.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            // Chuyển chuỗi tags thành mảng
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
            
            await problemService.create({
                ...formData,
                tags: tagsArray
            });
            
            message.success("Problem created successfully!");
            navigate("/"); 
        } catch (error) {
            console.error(error);
            message.error("Failed to create problem. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Style cho Difficulty Option
    const DifficultyOption = ({ value, label }: { value: string, label: string }) => {
        const isSelected = formData.difficulty === value;
        return (
            <div 
                onClick={() => handleChange('difficulty', value)}
                className={`
                    cursor-pointer p-4 rounded-lg border transition-all duration-200 flex items-center gap-3
                    ${isSelected 
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary' 
                        : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card'
                    }
                `}
            >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted-foreground'}`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="font-medium">{label}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
            <Navbar />
            
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                
                {/* --- PAGE HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Problem</h1>
                        <p className="text-muted-foreground text-lg">
                            Share your mathematical challenge. Use LaTeX syntax for formulas (e.g., <code className="bg-secondary px-1 py-0.5 rounded text-sm">$$E=mc^2$$</code>).
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="gap-2">
                            <EyeOutlined /> Preview
                        </Button>
                        <Button 
                            variant="default" 
                            className="gap-2 px-6" 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Posting..." : <><SendOutlined /> Post Problem</>}
                        </Button>
                    </div>
                </div>

                {/* --- MAIN GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: FORM INPUTS */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Problem Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g., Proving the Riemann Hypothesis for small values"
                                className="w-full p-4 rounded-xl bg-card/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </div>

                        {/* Content Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Problem Description</label>
                            <textarea 
                                placeholder="Describe the problem, constraints, and background. You can use LaTeX for math..."
                                className="w-full h-[400px] p-4 rounded-xl bg-card/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y placeholder:text-muted-foreground/50 text-foreground leading-relaxed"
                                value={formData.content}
                                onChange={(e) => handleChange('content', e.target.value)}
                            />
                        </div>

                        {/* Tags Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tags (Comma Separated)</label>
                            <input 
                                type="text" 
                                placeholder="algebra, number-theory, proof"
                                className="w-full p-4 rounded-xl bg-card/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                value={formData.tags}
                                onChange={(e) => handleChange('tags', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SIDEBAR */}
                    <div className="space-y-8">
                        
                        {/* Difficulty Selector */}
                        <div className="p-6 rounded-xl border border-border bg-card/30">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 block">Difficulty</label>
                            <div className="space-y-3">
                                <DifficultyOption value="Easy" label="Easy" />
                                <DifficultyOption value="Medium" label="Medium" />
                                <DifficultyOption value="Hard" label="Hard" />
                            </div>
                        </div>

                        {/* Guidelines Box */}
                        <div className="p-6 rounded-xl border border-blue-500/20 bg-blue-500/5">
                            <div className="flex items-center gap-2 mb-4 text-blue-500">
                                <InfoCircleOutlined />
                                <span className="font-bold">Guidelines</span>
                            </div>
                            <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
                                <li>Ensure the problem is clearly stated and self-contained.</li>
                                <li>Use appropriate tags to help solvers find your content.</li>
                                <li>Avoid duplicate problems already in the database.</li>
                            </ul>
                            
                            <div className="mt-6 pt-4 border-t border-blue-500/10">
                                <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center gap-2 transition-colors">
                                    <QuestionCircleOutlined /> How to use LaTeX?
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
            {/* <Footer /> */}
        </div>
    );
}