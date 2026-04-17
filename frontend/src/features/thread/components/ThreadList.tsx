import type { ThreadItem } from "../types/thread.type";
import ThreadCard from "./ThreadCard";

type ThreadListProps = {
  threads: ThreadItem[];
  onToggleLike: (threadId: string) => void | Promise<void>;
  onEditThread: (thread: ThreadItem) => void | Promise<void>;
  onDeleteThread: (thread: ThreadItem) => void | Promise<void>;
  currentUserId?: string | null;
  onThreadClick?: (threadId: string) => void;
};

export default function ThreadList({
  threads,
  onToggleLike,
  onEditThread,
  onDeleteThread,
  currentUserId,
  onThreadClick,
}: ThreadListProps) {
  return (
    <section className="space-y-4">
      {threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          onToggleLike={onToggleLike}
          onEditThread={onEditThread}
          onDeleteThread={onDeleteThread}
          isOwner={Boolean(currentUserId && thread.authorId === currentUserId)}
          onClick={onThreadClick}
        />
      ))}
    </section>
  );
}
