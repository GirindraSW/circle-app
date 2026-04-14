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

export type CreateThreadInput = {
  content: string;
  image?: string;
  userId: string;
};

export type ThreadDetailItem = {
  id: string;
  content: string;
  image: string | null;
  createdAt: Date;
  likes: number;
  replies: number;
  liked: boolean;
  user: {
    id: string | null;
    username: string;
    name: string;
    profile_picture: string | null;
  };
};

export type ThreadReplyItem = {
  id: string;
  content: string;
  image: string | null;
  created_at: Date;
  user: {
    id: string | null;
    username: string;
    name: string;
    profile_picture: string | null;
  };
};
