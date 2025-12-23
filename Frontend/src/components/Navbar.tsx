import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { CalculatorOutlined } from "@ant-design/icons";
import { authService } from "../services/auth.service";

export const Navbar = () => {
  const navigate = useNavigate();
  // Check login
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          {/* Icon nền nhạt theo màu primary */}
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <CalculatorOutlined style={{ fontSize: '18px' }} />
          </div>
          <span className="text-xl font-bold text-foreground">Math Forum</span>
        </Link>

        {/* MENU LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {["Problems", "Solutions", "Community"].map((item) => (
            <Link 
              key={item} 
              to="#" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};