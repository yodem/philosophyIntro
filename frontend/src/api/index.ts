import axios from "axios";
import {
  Philosopher,
  Question,
  Term,
  UpdatePhilosopherDto,
  UpdateQuestionDto,
  UpdateTermDto,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const philosophersApi = {
  getAll: async () => {
    try {
      const res = await api.get<Philosopher[]>("/philosophers");
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  getOne: async (id: number) => {
    try {
      const res = await api.get<Philosopher>(`/philosophers/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  update: async (id: number, data: UpdatePhilosopherDto) => {
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
  getAll: async () => {
    try {
      const res = await api.get<Question[]>("/questions");
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  getOne: async (id: number) => {
    try {
      const res = await api.get<Question>(`/questions/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  update: async (id: number, data: UpdateQuestionDto) => {
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
  getAll: async () => {
    try {
      const res = await api.get<Term[]>("/terms");
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  getOne: async (id: number) => {
    try {
      const res = await api.get<Term>(`/terms/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  update: async (id: number, data: UpdateTermDto) => {
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
