import axios from "axios";

export const baseHost = "https://api.gta.education";
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

const apiMethod = {
  get,
  post,
};

export default apiMethod;