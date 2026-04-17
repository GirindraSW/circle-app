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

type UpdateThreadResponse = {
  code: number;
  status: string;
  message: string;
  data: ThreadApiItem;
};

type DeleteThreadResponse = {
  code: number;
  status: string;
  message: string;
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

type CreateReplyResponse = {
  code: number;
  status: string;
  message: string;
  data: {
    reply: ThreadReplyApiItem;
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

export const updateThreadRequest = async (threadId: string, content: string) => {
  const response = await api.put<UpdateThreadResponse>(`/thread/${threadId}`, {
    content,
  });
  return response.data;
};

export const deleteThreadRequest = async (threadId: string) => {
  const response = await api.delete<DeleteThreadResponse>(`/thread/${threadId}`);
  return response.data;
};

export const createReplyRequest = async (threadId: string, payload: FormData) => {
  const response = await api.post<CreateReplyResponse>(
    `/reply?thread_id=${encodeURIComponent(threadId)}`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const likeThreadRequest = async (threadId: string) => {
  const response = await api.post("/like", { thread_id: threadId });
  return response.data;
};

export const unlikeThreadRequest = async (threadId: string) => {
  const response = await api.delete("/like", {
    data: {
      thread_id: threadId,
    },
  });
  return response.data;
};

export type { ThreadApiItem, ThreadDetailApiItem, ThreadReplyApiItem };
