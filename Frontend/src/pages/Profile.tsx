import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileTabs } from "../components/profile/ProfileTabs";
import { authService } from "../services/auth.service";
import { problemService } from "../services/problem.service";
import type { UserProfile } from "../types/auth.types";
import type { Problem } from "../types/problem.types";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [myProblems, setMyProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, problemsData] = await Promise.all([
          authService.getCurrentUser(),
          problemService.getMyProblems()
        ]);
        setUser(userData);
        setMyProblems(problemsData);
      } catch (error) {
        console.error("Failed to load profile", error);
        message.error("Session expired. Please login again.");
        authService.logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spin size="large" />
      </div>
    );
  }

  // Fallback data
  const stats = {
    problemsCount: myProblems.length,
    solutionsCount: 15, // Hardcode tạm hoặc lấy từ API
    reputation: user?.reputation || 0
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col text-foreground">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 flex-grow w-full">
        {/* Layout Grid 2 cột: Trái 300px, Phải 1fr */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
          
          {/* CỘT TRÁI */}
          <ProfileHeader 
            user={user} 
            setUser={setUser} 
            stats={stats}
          />

          {/* CỘT PHẢI */}
          <ProfileTabs problems={myProblems} />
          
        </div>
      </main>

      <Footer />
    </div>
  );
}