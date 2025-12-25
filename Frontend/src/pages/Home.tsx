// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { ProblemCard } from "../components/ProblemCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { problemService } from "../services/problem.service";
import type { Problem, ProblemFilter } from "../types/problem.types";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { authService } from "../services/auth.service";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";

export default function HomePage() {
  const navigate = useNavigate();

  // State quản lý dữ liệu và bộ lọc
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ProblemFilter>({
    page: 1,
    pageSize: 10,
    difficulty: undefined,
    category: undefined,
    sortBy: "CreatedAt",
    isDescending: true,
  });
  const [totalCount, setTotalCount] = useState(0);

  // Gọi API khi filters thay đổi
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const result = await problemService.getAll(filters);
        // Nếu là trang 1 thì set mới, nếu trang > 1 (Load more) thì nối thêm
        if (filters.page === 1) {
          setProblems(result.items);
        } else {
          setProblems((prev) => [...prev, ...result.items]);
        }
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error("Failed to fetch problems", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce hoặc gọi trực tiếp (ở đây gọi trực tiếp cho đơn giản)
    fetchProblems();
  }, [filters]);

  // Handlers
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === "All" ? undefined : e.target.value;
    setFilters((prev) => ({ ...prev, difficulty: val, page: 1 })); // Reset về trang 1 khi lọc
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === "All" ? undefined : e.target.value;
    setFilters((prev) => ({ ...prev, category: val, page: 1 }));
  };

  const handleLoadMore = () => {
    setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
  };
  
  const handlePostProblemClick = (e: React.MouseEvent) => {
    const token = authService.getToken();
    
    // Nếu chưa có token (chưa đăng nhập)
    if (!token) {
      e.preventDefault(); // Ngăn không cho thẻ Link chuyển trang
      
      // Thông báo và chuyển hướng
      Modal.confirm({
        title: 'Authentication Required',
        icon: <ExclamationCircleOutlined />,
        content: 'You need to log in to share your mathematical problems with the community.',
        okText: 'Login Now',
        cancelText: 'Cancel',
        okType: 'primary',
        centered: true, // Căn giữa màn hình cho đẹp
        onOk() {
          navigate("/login");
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Section (Giữ nguyên) */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-primary/5 to-background border border-border/50 mb-12 p-8 sm:p-12 text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight text-balance">
              Collaborate on{" "}
              <span className="text-primary">Mathematical Problems</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Share problems, discuss solutions, and contribute to training the
              next generation of mathematical AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/problems/create" onClick={handlePostProblemClick}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-semibold text-base px-8 h-12 shadow-lg shadow-primary/20"
                >
                  Post a Problem
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto font-semibold text-base h-12 bg-background/50 backdrop-blur-sm"
              >
                Browse Solutions
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section (Tạm thời hardcode hoặc gọi API thống kê riêng) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Problems Submitted", value: totalCount.toString() }, // Dùng số thật
            { label: "Solutions Shared", value: "5,821" },
            { label: "Active Members", value: "892" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="p-6 text-center border-border bg-card/50 hover:bg-card transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Recent Problems
            <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          </h2>

          <div className="flex w-full sm:w-auto gap-3">
            <select
              onChange={handleDifficultyChange}
              className="w-full sm:w-40 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              onChange={handleCategoryChange}
              className="w-full sm:w-40 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Algebra">Algebra</option>
              <option value="Calculus">Calculus</option>
              <option value="Geometry">Geometry</option>
              <option value="NumberTheory">Number Theory</option>
            </select>
          </div>
        </div>

        {/* Problems Grid */}
        {loading && problems.length === 0 ? (
          <div className="text-center py-20">Loading problems...</div>
        ) : problems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {problems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl mb-12 bg-card/30">
            <div className="text-muted-foreground text-lg">
              No problems found matching your filters.
            </div>
            <Button
              variant="link"
              onClick={() =>
                setFilters({
                  page: 1,
                  pageSize: 10,
                  sortBy: "CreatedAt",
                  isDescending: true,
                })
              }
              className="mt-2 text-primary"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {problems.length < totalCount && (
          <div className="text-center mb-12">
            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px]"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More Problems"}
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
