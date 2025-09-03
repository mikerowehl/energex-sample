import axios from "axios";

const NODE_BASE = "http://127.0.0.1:4000/cache";

function getAuthHeader() {
  const token = localStorage.getItem("jwt");
  return { Authorization: `Bearer ${token}` };
}

export const getPosts = () => {
  return axios.get(`${NODE_BASE}/posts`, {
    headers: getAuthHeader(),
  });
};

export const getPost = (id: number) => {
  return axios.get(`${NODE_BASE}/posts/${id}`, {
    headers: getAuthHeader(),
  });
};

