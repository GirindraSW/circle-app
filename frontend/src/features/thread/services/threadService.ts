import api from "@/services/api";

type ThreadApiItem = {
  id: string;
  content: string;
  image: string | null;
  createdAt: string;
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

type ThreadDetailApiItem = {
  id: string;
  content: string;
  image: string | null;
  createdAt: string;
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

type ThreadReplyApiItem = {
  id: string;
  content: string;
  image: string | null;
  created_at: string;
  user: {
    id: string | null;
    username: string;
    name: string;
    profile_picture: string | null;
  };
};

type GetThreadsResponse = {
  code: number;
  status: string;
  message: string;
  data: ThreadApiItem[];
};

type CreateThreadResponse = {
  code: number;
  status: string;
  message: string;
  data: ThreadApiItem;
};

type GetThreadDetailResponse = {
  code: number;
  status: string;
  message: string;
  data: ThreadDetailApiItem;
};

type GetThreadRepliesResponse = {
  code: number;
  status: string;
  message: string;
  data: {
    replies: ThreadReplyApiItem[];
  };
};

export const getThreadsRequest = async () => {
  const response = await api.get<GetThreadsResponse>("/threads");
  return response.data;
};

export const createThreadRequest = async (payload: FormData) => {
  const response = await api.post<CreateThreadResponse>("/threads", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getThreadDetailRequest = async (threadId: string) => {
  const response = await api.get<GetThreadDetailResponse>(`/thread/${threadId}`);
  return response.data;
};

export const getThreadRepliesRequest = async (threadId: string) => {
  const response = await api.get<GetThreadRepliesResponse>(`/thread/${threadId}/replies`);
  return response.data;
};

export type { ThreadApiItem, ThreadDetailApiItem, ThreadReplyApiItem };
