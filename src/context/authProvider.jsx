import { useEffect, useReducer, useCallback } from "react";
import axios from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import AuthContext from "./jwtContext";
import { LoadingProgress } from "@/components/loader";
import { ip } from "@/config/config";
 
const API_URL = "https://dev.raceabove.eazr.in";
 
const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};
 
const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};
 
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        isInitialized: true,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
      };
    case "SENDOTP":
      return {
        ...state,
        isAuthenticated: false,
        user: action.payload.user,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };
    case "REGISTER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    default:
      return state;
  }
};
 
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
 
  const login = useCallback(async (navigate, phoneNumber, otp) => {
    const formatedphoneNumber = `+91${phoneNumber}`;
    const response = await axios.post(`${ip}/v2/auth/verify-otp`, {
      phoneNumber: formatedphoneNumber,
      otp,
      role: "admin",
    });

    localStorage.setItem(
      "raceabove",
      JSON.stringify(response?.data?.data)
    );

    dispatch({
      type: "LOGIN",
      payload: {
        user: response?.data?.data,
        isAuthenticated: true,
      },
    });

    if (response?.data?.status === 200) {
      setSession(response?.data?.accessToken);
      navigate("/");
      toast.success("login succesfully");
    } else {
      toast.error("wrong otp entered, Please check");
      console.log("error in verify otp");
    }
  }, []);

  const sendOTP = useCallback(async (navigate, number) => {
    const response = await axios.post(`${ip}/v2/admins/send-otp`, {
      phoneNumber: `+91${number}`,
    });

    if (response?.data?.status === 201) {
      window.localStorage.setItem("phoneNumber", number);
      navigate("/verify-code");
    }

    setSession(response?.data?.data?.requestId);
    dispatch({
      type: "SENDOTP",
      payload: {
        user: response?.data?.data?.requestId,
        isAuthenticated: false,
      },
    });
  }, []);
 
  const register = useCallback(async (name, email, password) => {
    const { data } = await axios.post(`${API_URL}/users`, {
      name,
      email,
      password,
    });
    setSession(data.token);
    dispatch({
      type: "REGISTER",
      payload: {
        user: data,
        isAuthenticated: true,
      },
    });
  }, []);
 
  const logout = () => {
    setSession(null);
    dispatch({
      type: "LOGOUT",
      payload: {
        user: null,
        isAuthenticated: false,
      },
    });
  };
 
  const checkCurrentUser = useCallback(async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      if (adminData?.accessToken) {
        setSession(adminData?.accessToken);
        dispatch({
          type: "INIT",
          payload: {
            user: adminData,
            isAuthenticated: true,
          },
        });
      } else {
        dispatch({
          type: "INIT",
          payload: {
            user: null,
            isAuthenticated: false,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: "INIT",
        payload: {
          user: null,
          isAuthenticated: false,
        },
      });
    }
  }, []);
 
  useEffect(() => {
    checkCurrentUser();
  }, []);
 
  if (!state.isInitialized) return <LoadingProgress />;
 
  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        login,
        register,
        logout,
        sendOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}