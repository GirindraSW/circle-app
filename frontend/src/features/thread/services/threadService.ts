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

type GetThreadsResponse = {
  code: number;
  status: string;
  message: string;
  data: ThreadApiItem[];
};

export const getThreadsRequest = async () => {
  const response = await api.get<GetThreadsResponse>("/threads");
  return response.data;
};
