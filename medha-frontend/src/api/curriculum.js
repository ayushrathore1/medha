import api from "./api";

export async function fetchCurriculumTree() {
  const res = await api.get("/curriculum/tree");
  return res.data;
}
