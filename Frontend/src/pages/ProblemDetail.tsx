import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import { problemService } from "../services/problem.service";
import { solutionService } from "../services/solution.service";
import { authService } from "../services/auth.service";
import { message, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import type { ProblemDetailDto } from "../types/problem.types";
import type { UserProfile } from "../types/auth.types";

// Import các component con
import { ProblemHeader } from "../components/problem-detail/ProblemHeader";
import { ProblemContent } from "../components/problem-detail/ProblemContent";
import { SolutionList } from "../components/problem-detail/SolutionList";
import { SolutionForm } from "../components/problem-detail/SolutionForm";
import { AuthorSidebar } from "../components/problem-detail/AuthorSidebar";

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<ProblemDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Lấy thông tin user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
        try {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        } catch {
            // Chưa login cũng không sao
        }
    };
    fetchUser();
  }, []);

  // Hàm load lại dữ liệu bài toán (dùng khi Post, Edit, Delete solution)
  const fetchProblemData = async () => {
      if (!id) return;
      try {
        const problemData = await problemService.getById(id);
        setProblem(problemData);
      } catch (error) {
        console.error("Failed to refresh problem");
      }
  };

  useEffect(() => {
    const init = async () => {
        setLoading(true);
        await fetchProblemData();
        setLoading(false);
    }
    init();
  }, [id]);

  const handlePostSolution = async (content: string, steps: string[]) => {
    if (!content.trim()) {
      message.warning("Please enter solution content.");
      return;
    }
    if (!problem) return;

    try {
      setSubmitting(true);
      const validSteps = steps.filter((step) => step.trim() !== "");

      await solutionService.create({
        problemId: problem.id,
        content: content,
        steps: validSteps.length > 0 ? validSteps : undefined,
      });

      message.success("Solution posted successfully!");
      await fetchProblemData(); // Reload lại data
    } catch (error: any) {
      message.error("Failed to post solution.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptSolution = async (solutionId: string) => {
    try {
      await solutionService.accept(solutionId);
      message.success("Solution accepted successfully!");
      await fetchProblemData(); // Reload lại data
    } catch (error) {
      message.error("Failed to accept solution.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spin size="large" /></div>;
  if (!problem) return <div className="text-center mt-20">Problem not found</div>;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <Button variant="ghost" className="pl-0 gap-2 text-muted-foreground hover:text-primary" onClick={() => navigate("/")}>
            <LeftOutlined /> Back to Problems
          </Button>
        </div>

        <ProblemHeader problem={problem} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          
          <div>
            <ProblemContent content={problem.content} tags={problem.tags} />

            {/* --- TRUYỀN THÊM onRefreshRequest --- */}
            <SolutionList 
              solutions={problem.solutions} 
              currentUserId={currentUser?.userId}
              problemAuthorId={problem.userId}
              onAcceptSolution={handleAcceptSolution}
              onRefreshRequest={fetchProblemData} 
            />

            <SolutionForm 
              currentUser={currentUser}
              onSubmit={handlePostSolution}
              submitting={submitting}
            />
          </div>

          <aside>
            <AuthorSidebar 
               author={{
                 userId: problem.userId,
                 username: problem.username,
                 avatar: problem.userAvatar,
                 reputation: problem.userReputation
               }}
             />
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
}