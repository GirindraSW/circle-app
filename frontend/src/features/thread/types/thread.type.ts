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

export type ThreadDetailItem = {
  id: string;
  content: string;
  image?: string;
  createdAtLabel: string;
  likes: number;
  replies: number;
  liked: boolean;
  user: {
    id: string | null;
    username: string;
    name: string;
    profile_picture?: string | null;
  };
};

export type ThreadReplyItem = {
  id: string;
  content: string;
  image?: string;
  createdAtLabel: string;
  user: {
    id: string | null;
    username: string;
    name: string;
    profile_picture?: string | null;
  };
};
