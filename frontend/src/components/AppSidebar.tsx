import { Heart, Home, LogOut, Search, UserRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
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
    <aside className="flex h-full min-h-screen flex-col border-r border-zinc-800 bg-zinc-950 px-4 py-6">
      <h1 className="mb-6 text-5xl font-extrabold leading-none text-green-500">circle</h1>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-zinc-900 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
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
        className="mt-5 w-full rounded-full bg-green-600 text-white hover:bg-green-500"
        onClick={() => navigate("/home")}
      >
        Create Post
      </Button>

      <Button
        type="button"
        variant="outline"
        className="mt-auto border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </aside>
  );
}

