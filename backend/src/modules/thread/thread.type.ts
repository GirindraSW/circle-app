export type ThreadListItem = {
  id: string;
  content: string;
  image: string | null;
  createdAt: Date;
  likeCount: number;
  replyCount: number;
  liked: boolean;
  author: {
    id: string | null;
    username: string;
    name: string;
    avatar: string | null;
  };
};
