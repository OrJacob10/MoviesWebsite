const axios = require('axios');
const url = "http://localhost:8080/subscriptions";

const getSubscriptions = async () => {
  const { data: subscriptions } = await axios.get(url);
  return subscriptions;
};

const getSubscriptionById = async (id) => {
  const { data: subscription } = await axios.get(`${url}/${id}`);
  return subscription;
};

const getSubscriptionsWithDetails = async () => {
  const { data: subscriptions } = await axios.get(`${url}/details`);
  return subscriptions;
};

const addSubscription = async (data) => {
  const response = await axios.post(url, data);
  return response.data;
};

const updateSubscription = async (id, data) => {
  const response = await axios.put(`${url}/${id}`, data);
  return response.data; 
};

const deleteSubscription = async (id) => {
  const response = await axios.delete(`${url}/${id}`);
  return response.data; 
};

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  getSubscriptionsWithDetails,
  addSubscription,
  updateSubscription,
  deleteSubscription,
};
