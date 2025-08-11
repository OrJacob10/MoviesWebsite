import axios from "axios";

const getToken = () => localStorage.getItem("token");

const getAllMembers = async (url) => {
  const response = await axios.get(url, {
    headers: { token: getToken() },
  });
  return response.data;
};

const getMember = async (url, id) => {
  const response = await axios.get(`${url}/${id}`, {
    headers: { token: getToken() },
  });
  return response.data;
};

const addMember = async (url, member) => {
  try {
    const response = await axios.post(url, member, {
      headers: { token: getToken() },
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Unknown error";

    throw new Error(message);
  }
};

const updateMember = async (url, id, member) => {
  const response = await axios.put(`${url}/${id}`, member, {
    headers: { token: getToken() },
  });
  return response.data;
};

const deleteMember = async (url, id) => {
  const response = await axios.delete(`${url}/${id}`, {
    headers: { token: getToken() },
  });
  return response.data;
};

export { getAllMembers, getMember, addMember, updateMember, deleteMember };
