import api from "@/services/api";
import type { SearchUserItem } from "../types/user.type";

type SearchUsersResponse = {
  status: "success" | "error";
  data: {
    users: SearchUserItem[];
  };
};

export const searchUsersRequest = async (query: string) => {
  const response = await api.get<SearchUsersResponse>("/users/search", {
    params: {
      q: query,
    },
  });
  return response.data;
};

