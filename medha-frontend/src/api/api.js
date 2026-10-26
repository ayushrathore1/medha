// src/api/api.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api";
// For CRA: process.env.REACT_APP_BACKEND_URL + '/api'

export function getToken() {
  return localStorage.getItem("token");
}

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Subjects
export const fetchSubjects = async () => {
  const res = await api.get("/subjects");
  return res.data.subjects;
};

// Notes
export const fetchNotes = async (subjectId) => {
  const res = await api.get("/notes", { params: { subject: subjectId } });
  return res.data.notes;
};

// Create new subject
export const createSubject = async ({ name, description }) => {
  const res = await api.post("/subjects", { name, description });
  return res.data.subject;
};

// Create new note (as text note)
export const createNote = async ({ title, content, subject }) => {
  const res = await api.post("/notes/text", { title, content, subject });
  return res.data.note;
};

// Search Engine API
export const searchDatabase = async (params, signal) => {
  const res = await api.get("/search", { params, signal });
  return res.data;
};

export const fetchSearchSuggestions = async (q, signal) => {
  const res = await api.get("/search/suggestions", { params: { q }, signal });
  return res.data;
};

export const fetchPopularSearches = async () => {
  const res = await api.get("/search/popular");
  return res.data;
};

export const logSearchQuery = async (data) => {
  const res = await api.post("/search/history", data);
  return res.data;
};

export default api;

