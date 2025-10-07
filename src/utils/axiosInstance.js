import axios from "axios";
import toast from "react-hot-toast";

 
const axiosInstance = axios.create({
  baseURL: "https://raceabove.eazr.in",
});
 
let isRefreshing = false;
let failedQueue = [];
 
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
 
// Attach token before request
axiosInstance.interceptors.request.use((config) => {
  const raw = localStorage.getItem("raceabove");
  const tokenData = raw ? JSON.parse(raw) : null;
  const accessToken = tokenData?.accessToken;
 
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
 
  return config;
});
 
// Handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
 
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
 
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
 
      isRefreshing = true;
 
      try {
        const raw = localStorage.getItem("raceabove");
        const tokenData = raw ? JSON.parse(raw) : null;
        const refreshToken = tokenData?.refreshToken;
 
        console.log(refreshToken, "updated");
 
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
 
        const res = await axios.post(
          "https://raceabove.eazr.in/v2/auth/refresh-tokens",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
 
        const { accessToken, refreshToken: newRefreshToken } =
          res.data.data;
 
        const updatedUser = {
          ...tokenData,
          accessToken,
          refreshToken: newRefreshToken,
        };
 
        localStorage.setItem(
          "raceabove",
          JSON.stringify(updatedUser)
        );
 
        axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
 
        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("raceabove");
        window.location.href = "/login"
        toast.error("Session expired. Please log in again.");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
 
    return Promise.reject(error);
  }
);
 
export default axiosInstance;