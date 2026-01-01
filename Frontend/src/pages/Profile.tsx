// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { Spin, message } from "antd";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileTabs } from "../components/profile/ProfileTabs";
import { authService } from "../services/auth.service";
import { problemService } from "../services/problem.service";
import type { UserProfile } from "../types/auth.types";
import type { Problem } from "../types/problem.types";
import type { SolutionDto } from "../types/solution.types";
import { solutionService } from "../services/solution.service";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>(); // Lấy ID từ URL (nếu có)

  const [user, setUser] = useState<UserProfile | null>(null);
  const [myProblems, setMyProblems] = useState<Problem[]>([]);
  const [mySolutions, setMySolutions] = useState<SolutionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false); // Biến check quyền chính chủ

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Lấy user hiện tại đang đăng nhập (để so sánh)
        const currentUser = await authService
          .getCurrentUser()
          .catch(() => null);

        let profileData: UserProfile;
        let problemsData: Problem[] = [];
        let solutionsData: SolutionDto[] = [];

        // 2. Logic phân chia: Xem người khác hay xem chính mình
        if (userId) {
          // --- TRƯỜNG HỢP: XEM PROFILE NGƯỜI KHÁC ---
          const res = await authService.getProfile(userId);
          if (res.data.success && res.data.data) {
            profileData = res.data.data;
            const [probRes, solRes] = await Promise.all([
              problemService.getUserProblems(userId),
              solutionService.getUserSolutions(userId),
            ]);
            problemsData = probRes;
            solutionsData =
              solRes.data.success && solRes.data.data ? solRes.data.data : [];
          } else {
            throw new Error("User not found");
          }

          // Check xem có phải đang xem profile của chính mình qua URL không
          setIsOwnProfile(currentUser?.userId === userId);
        } else {
          // --- TRƯỜNG HỢP: XEM PROFILE CHÍNH MÌNH (/profile) ---
          if (!currentUser) {
            message.error("Please login first");
            navigate("/login");
            return;
          }
          profileData = currentUser;
          const [probRes, solRes] = await Promise.all([
            problemService.getMyProblems(),
            solutionService.getMySolutions(), // Gọi API lấy solutions
          ]);
          problemsData = probRes;
          solutionsData = solRes.data.success && solRes.data.data ? solRes.data.data : [];
          setIsOwnProfile(true);
        }

        setUser(profileData);
        setMyProblems(problemsData);
        setMySolutions(solutionsData);
      } catch (error) {
        console.error("Failed to load profile", error);
        message.error("Failed to load profile.");
        // Nếu lỗi khi xem chính mình thì logout
        if (!userId) {
          authService.logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const stats = {
    problemsCount: myProblems.length,
    solutionsCount: mySolutions.length,
    reputation: user?.reputation || 0,
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col text-foreground">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
          {/* Truyền isOwnProfile để ẩn nút Edit/Upload nếu không phải chính chủ */}
          <ProfileHeader
            user={user}
            setUser={setUser}
            stats={stats}
            isOwnProfile={isOwnProfile}
          />

          <ProfileTabs problems={myProblems} solutions={mySolutions} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
