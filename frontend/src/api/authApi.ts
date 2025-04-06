import api from "./apiClient";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
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
    console.log("Login credentials:", credentials);

    return await api.post("auth/login", credentials);
  },

  signup: async (credentials: SignupCredentials): Promise<User> => {
    return await api.post("auth/signup", credentials);
  },

  getProfile: async (): Promise<User> => {
    return await api.get("auth/profile");
  },
};
