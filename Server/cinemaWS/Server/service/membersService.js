const axios = require("axios");
const BASE_URL = "http://localhost:8080/members";

const getMembers = async () => {
    const { data } = await axios.get(BASE_URL);
    return data;
};

const getMemberById = async (id) => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
};

const addMember = async (memberData) => {
    const { data } = await axios.post(BASE_URL, memberData);
    return data;
};

const updateMember = async (id, memberData) => {
    const { data } = await axios.put(`${BASE_URL}/${id}`, memberData);
    return data;
};

const deleteMember = async (id) => {
    const { data } = await axios.delete(`${BASE_URL}/${id}`);
    return data;
};

module.exports = {
    getMembers,
    getMemberById,
    addMember,
    updateMember,
    deleteMember,
};
