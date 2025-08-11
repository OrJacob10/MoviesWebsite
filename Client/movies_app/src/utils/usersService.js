import axios from "axios";

const getToken = () => localStorage.getItem("token"); 

const getAllUsers = async (url) => {
  const response = await axios.get(url, {
    headers: { token: getToken() },
  });

  return response.data;
};

const getUser = async (url, id) =>{
  const response = await axios.get(`${url}/${id}`, {
    headers: { token: getToken() },
  });
  return response.data;
}

const addUser = async (url, user) => {
  try {
    const response = await axios.post(url, user, {
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

const updateUser = async (url, id, user) => {
  const response = await axios.put(`${url}/${id}`, user, {
    headers: { token: getToken() },
  });

  return response.data;
};

const deleteUser = async (url, id) => {
  const response = await axios.delete(`${url}/${id}`, {
    headers: { token: getToken() },
  });

  return response.data;
};

export { getAllUsers,getUser, addUser, updateUser, deleteUser };
