import api from "./apiClient";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  roles: string[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return await api.post("auth/login", credentials);
  },

  getProfile: async (): Promise<User> => {
    return await api.get("auth/profile");
  },
};
