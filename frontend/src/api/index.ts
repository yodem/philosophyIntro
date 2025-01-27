import axios from "axios";
import {
  Philosopher,
  Question,
  Term,
  UpdatePhilosopherDto,
  UpdateQuestionDto,
  UpdateTermDto,
  PaginatedResponse,
  SearchParams,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const philosophersApi = {
  getAll: async (
    params: SearchParams = { limit: 1000, page: 1, search: "" }
  ) => {
    try {
      const res = await api.get<PaginatedResponse<Philosopher>>(
        "/philosophers",
        { params }
      );
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  getOne: async (id: string) => {
    try {
      const res = await api.get<Philosopher>(`/philosophers/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  update: async (id: string, data: UpdatePhilosopherDto) => {
    try {
      const res = await api.patch<Philosopher>(`/philosophers/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  create: async (data: UpdatePhilosopherDto) => {
    try {
      const res = await api.post<Philosopher>("/philosophers", data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export const questionsApi = {
  getAll: async (
    params: SearchParams = { limit: 1000, page: 1, search: "" }
  ) => {
    try {
      const res = await api.get<PaginatedResponse<Question>>("/questions", {
        params,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  getOne: async (id: string) => {
    try {
      const res = await api.get<Question>(`/questions/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  update: async (id: string, data: UpdateQuestionDto) => {
    try {
      const res = await api.patch<Question>(`/questions/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  create: async (data: UpdateQuestionDto) => {
    try {
      const res = await api.post<Question>("/questions", data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export const termsApi = {
  getAll: async (
    params: SearchParams = { limit: 1000, page: 1, search: "" }
  ) => {
    try {
      const res = await api.get<PaginatedResponse<Term>>("/terms", { params });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  getOne: async (id: string) => {
    try {
      const res = await api.get<Term>(`/terms/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  update: async (id: string, data: UpdateTermDto) => {
    try {
      const res = await api.patch<Term>(`/terms/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  create: async (data: UpdateTermDto) => {
    try {
      const res = await api.post<Term>("/terms", data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
};
