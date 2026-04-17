import { cn } from "@/lib/utils";

type BrandMarkProps = {
  variant?: "inline" | "stacked";
  showTagline?: boolean;
  className?: string;
};

export default function BrandMark({
  variant = "inline",
  showTagline = false,
  className,
}: BrandMarkProps) {
  if (variant === "stacked") {
    return (
      <div className={cn("text-center", className)}>
        <img src="/circle-logo.png" alt="Circle logo" className="mx-auto h-36 w-36" />
        <h1 className="mt-5 text-6xl font-extrabold tracking-tight text-blue-600">Circle</h1>
        {showTagline ? <p className="mt-2 text-2xl text-slate-600">Connect. Share. Engage.</p> : null}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img src="/circle-logo.png" alt="Circle logo" className="h-10 w-10" />
      <p className="text-3xl font-extrabold tracking-tight text-blue-600">Circle</p>
    </div>
  );
}
