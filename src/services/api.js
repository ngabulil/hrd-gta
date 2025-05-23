import axios from "axios";

// export const baseHost = "https://api.gta.education";
export const baseHost = "http://localhost:1337";
const BASE_URL = `${baseHost}/api`;

const get = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const post = async (url, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const put = async (url, data) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteApi = async (url) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const apiMethod = {
  get,
  post,
  put,
  deleteApi,
};

export default apiMethod;
