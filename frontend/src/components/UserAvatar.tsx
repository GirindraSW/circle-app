import { cn } from "@/lib/utils";

type UserAvatarProps = {
  src?: string | null;
  name?: string;
  seed?: string | null;
  className?: string;
};

export default function UserAvatar({ src, name, seed, className }: UserAvatarProps) {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(seed || name || "circle");

  if (src) {
    return <img src={src} alt={name || "User"} className={cn("rounded-full object-cover", className)} />;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white",
        className,
      )}
      style={{ backgroundColor: bgColor }}
      aria-label={name || "User"}
      role="img"
    >
      {initials}
    </div>
  );
}

const getInitials = (value?: string) => {
  if (!value) return "U";
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getAvatarColor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 62% 46%)`;
};
