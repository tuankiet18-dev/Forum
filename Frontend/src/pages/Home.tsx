import { useState } from "react"
import { Navbar } from "../components/Navbar"
import { ProblemCard } from "../components/ProblemCard"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import type { Problem } from "../types/auth.types"

// --- Mock Data ---
const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Prove that the sum of angles in a triangle equals 180 degrees",
    content: "Using Euclidean geometry principles, provide a rigorous proof that demonstrates why the interior angles of any triangle sum to 180 degrees.",
    author: { username: "mathPro", reputation: 2450 },
    tags: ["geometry", "proof"],
    solutions: 12,
    createdAt: "2025-12-20",
    difficulty: "medium",
  },
  {
    id: "2",
    title: "Find the derivative of f(x) = x³ + 2x² - 5x + 1",
    content: "Calculate the first derivative of the given polynomial function using basic differentiation rules.",
    author: { username: "calculusKing", reputation: 1820 },
    tags: ["calculus", "derivative"],
    solutions: 8,
    createdAt: "2025-12-21",
    difficulty: "easy",
  },
  {
    id: "3",
    title: "Solve the Diophantine equation: x² + y² = z²",
    content: "Find all positive integer solutions to this famous equation. Discuss the relationship to Pythagorean triples.",
    author: { username: "numberTheory", reputation: 3100 },
    tags: ["number-theory", "algebra"],
    solutions: 15,
    createdAt: "2025-12-19",
    difficulty: "hard",
  },
  {
    id: "4",
    title: "Calculate the limit: lim(x→0) (sin x)/x",
    content: "Evaluate this fundamental limit without using L'Hôpital's rule. Show all steps clearly.",
    author: { username: "limitMaster", reputation: 1950 },
    tags: ["calculus", "limits"],
    solutions: 10,
    createdAt: "2025-12-22",
    difficulty: "medium",
  },
  {
    id: "5",
    title: "Prove the Fundamental Theorem of Arithmetic",
    content: "Provide a complete proof that every integer greater than 1 can be uniquely represented as a product of prime numbers.",
    author: { username: "primeSeeker", reputation: 2780 },
    tags: ["number-theory", "proof"],
    solutions: 6,
    createdAt: "2025-12-18",
    difficulty: "hard",
  },
  {
    id: "6",
    title: "Find the area under curve y = x² from x=0 to x=2",
    content: "Use definite integration to calculate the exact area bounded by the parabola and the x-axis.",
    author: { username: "integralWiz", reputation: 1650 },
    tags: ["calculus", "integration"],
    solutions: 14,
    createdAt: "2025-12-23",
    difficulty: "easy",
  },
]

export default function HomePage() {
  // State quản lý bộ lọc
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const [topicFilter, setTopicFilter] = useState("All")

  // Logic lọc bài toán
  const filteredProblems = mockProblems.filter((problem) => {
    const matchesDifficulty = difficultyFilter === "All" || problem.difficulty === difficultyFilter.toLowerCase()
    
    // Logic lọc theo tags (topic) - kiểm tra xem tags của bài toán có chứa topic đang chọn không
    const matchesTopic = topicFilter === "All" || problem.tags.some(tag => tag.includes(topicFilter.toLowerCase()))

    return matchesDifficulty && matchesTopic
  })

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section với Gradient nhẹ */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-primary/5 to-background border border-border/50 mb-12 p-8 sm:p-12 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight text-balance">
              Collaborate on <span className="text-primary">Mathematical Problems</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Share problems, discuss solutions, and contribute to training the next generation of mathematical AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto font-semibold text-base px-8 h-12 shadow-lg shadow-primary/20">
                Post a Problem
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold text-base h-12 bg-background/50 backdrop-blur-sm">
                Browse Solutions
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Problems Submitted", value: "1,247" },
            { label: "Solutions Shared", value: "5,821" },
            { label: "Active Members", value: "892" },
          ].map((stat, index) => (
            <Card key={index} className="p-6 text-center border-border bg-card/50 hover:bg-card transition-colors">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 tracking-tight">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Recent Problems
            <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {filteredProblems.length}
            </span>
          </h2>
          
          <div className="flex w-full sm:w-auto gap-3">
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full sm:w-40 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select 
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full sm:w-40 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
            >
              <option value="All">All Topics</option>
              <option value="Algebra">Algebra</option>
              <option value="Calculus">Calculus</option>
              <option value="Geometry">Geometry</option>
              <option value="Number">Number Theory</option>
            </select>
          </div>
        </div>

        {/* Problems Grid */}
        {filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl mb-12 bg-card/30">
            <div className="text-muted-foreground text-lg">No problems found matching your filters.</div>
            <Button 
              variant="link" 
              onClick={() => { setDifficultyFilter("All"); setTopicFilter("All"); }}
              className="mt-2 text-primary"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredProblems.length > 0 && (
          <div className="text-center mb-12">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Load More Problems
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <span className="font-bold text-lg">Math Forum</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A community-driven platform for mathematical problem solving and AI training. Join us to explore the beauty of math.
              </p>
            </div>
            
            {/* Footer Links Sections */}
            {[
              { title: "Resources", links: ["Documentation", "Guidelines", "FAQ"] },
              { title: "Community", links: ["Discord", "Forum", "Blog"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-primary transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2025 Math Forum AI Project. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}