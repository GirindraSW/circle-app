import { Heart, Home, LogOut, Search, UserRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/authSlice";
import { clearProfile } from "@/features/profile/profileSlice";

const menuItems = [
  { label: "Home", path: "/home", icon: Home },
  { label: "Search", path: "/search", icon: Search },
  { label: "Follows", path: "/follows?type=followers", icon: Heart },
  { label: "Profile", path: "/profile", icon: UserRound },
];

export default function AppSidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearProfile());
  };

  return (
    <aside className="flex h-full min-h-screen flex-col border-r border-blue-200 bg-blue-50 px-4 py-6">
      <BrandMark className="mb-6" />

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:bg-white hover:text-blue-700"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <Button
        type="button"
        className="mt-5 w-full rounded-full bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => navigate("/home")}
      >
        Create Post
      </Button>

      <Button
        type="button"
        variant="outline"
        className="mt-auto border-blue-200 bg-white text-slate-700 hover:bg-blue-100"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </aside>
  );
}
