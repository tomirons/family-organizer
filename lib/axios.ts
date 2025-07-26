// eslint-disable-next-line import/no-named-as-default
import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export default axios;