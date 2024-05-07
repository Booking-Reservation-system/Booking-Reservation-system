import axios from "axios";
import useTokenStore from "../src/hooks/storeToken";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(async function (config) {
  const { token, setToken } = useTokenStore(); // Moved inside the interceptor

  // Do something before request is sent
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // If token is null, handle session expiration
    setToken(null);
    console.log('Session expired. Please log in again');
  }
  return config;
},
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default instance;
