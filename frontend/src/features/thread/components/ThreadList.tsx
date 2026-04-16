import type { ThreadItem } from "../types/thread.type";
import ThreadCard from "./ThreadCard";

type ThreadListProps = {
  threads: ThreadItem[];
  onToggleLike: (threadId: string) => void | Promise<void>;
  onThreadClick?: (threadId: string) => void;
};

export default function ThreadList({ threads, onToggleLike, onThreadClick }: ThreadListProps) {
  return (
    <section className="space-y-4">
      {threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          onToggleLike={onToggleLike}
          onClick={onThreadClick}
        />
      ))}
    </section>
  );
}
