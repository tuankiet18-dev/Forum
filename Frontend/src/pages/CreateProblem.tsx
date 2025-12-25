import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { problemService } from '../services/problem.service';
import { useNavigate } from 'react-router-dom';

export default function CreateProblemPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Algebra',
        difficulty: 'Easy',
        tags: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Chuyển string tags thành mảng
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
            
            await problemService.create({
                ...formData,
                tags: tagsArray
            });
            alert("Problem created successfully!");
            navigate("/"); // Quay về trang chủ
        } catch (error) {
            console.error(error);
            alert("Failed to create problem");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Post a New Problem</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 font-medium">Title</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded-lg border bg-background"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                            minLength={5}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium">Category</label>
                            <select 
                                className="w-full p-3 rounded-lg border bg-background"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Algebra">Algebra</option>
                                <option value="Geometry">Geometry</option>
                                <option value="Calculus">Calculus</option>
                                <option value="NumberTheory">Number Theory</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Difficulty</label>
                            <select 
                                className="w-full p-3 rounded-lg border bg-background"
                                value={formData.difficulty}
                                onChange={e => setFormData({...formData, difficulty: e.target.value})}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Content</label>
                        <textarea 
                            className="w-full p-3 rounded-lg border bg-background h-40"
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            required
                            minLength={10}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Tags (comma separated)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. matrices, linear-algebra"
                            className="w-full p-3 rounded-lg border bg-background"
                            value={formData.tags}
                            onChange={e => setFormData({...formData, tags: e.target.value})}
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full">Submit Problem</Button>
                </form>
            </div>
        </div>
    );
}