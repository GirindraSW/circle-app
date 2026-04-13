export type ThreadItem = {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  image?: string;
  createdAtLabel: string;
  likeCount: number;
  replyCount: number;
  liked: boolean;
};