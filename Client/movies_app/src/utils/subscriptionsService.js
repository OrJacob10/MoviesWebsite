import axios from "axios";
import { store } from "../redux/store";

const getToken = () => localStorage.getItem("token"); 

const getAllSubscriptions = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: { token: getToken() },
    });
    return response.data;
  } catch (error) {
    console.error('Error in getAllSubscriptions:', error.response?.data || error.message);
    throw error;
  }
};

const getAllSubscriptionsWithDetails = async (url) => {
  try {
    const token = getToken();
    console.log('Token being sent:', token); // Debug log
    const response = await axios.get(`${url}/details`, {
      headers: { token },
    });
    return response.data;
  } catch (error) {
    console.error('Error in getAllSubscriptionsWithDetails:', error.response?.data || error.message);
    throw error;
  }
};

// const getSubscriptionById = async (url, id) =>
//   await axios.get(`${url}/${id}`);

const addSubscription = async (url, subscription) => {
  try {
    const response = await axios.post(url, subscription, {
      headers: { token: getToken() },
    });
    return response.data;
  } catch (error) {
    console.error('Error in addSubscription:', error.response?.data || error.message);
    throw error;
  }
};

const updateSubscription = async (url, id, subscription) => {
  try {
    const response = await axios.put(`${url}/${id}`, subscription, {
      headers: { token: getToken() },
    });
    return response.data;
  } catch (error) {
    console.error('Error in updateSubscription:', error.response?.data || error.message);
    throw error;
  }
};

const deleteSubscription = async (url, id) => {
  try {
    const response = await axios.delete(`${url}/${id}`, {
      headers: { token: getToken() },
    });
    return response.data;
  } catch (error) {
    console.error('Error in deleteSubscription:', error.response?.data || error.message);
    throw error;
  }
};

export { 
  getAllSubscriptions, 
  getAllSubscriptionsWithDetails,
  addSubscription, 
  updateSubscription, 
  deleteSubscription 
};
