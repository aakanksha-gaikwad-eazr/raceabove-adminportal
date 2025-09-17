import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all Terms and condtions
export const getAppTnc = createAsyncThunk(
  "appTncSlice/getAppTnc",
  async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/app-terms-and-conditions`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch all app terms-and-conditions");
      throw new Error("Failed to fetch all app the terms-and-conditions");
    }
  }
);


//get single Terms and condtions
export const getSingleAppTnc = createAsyncThunk(
  "appTncSlice/getSingleAppTnc",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        console.log("'Access token not found in localStorage'");
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/app-terms-and-conditions/${id}`;

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("single app Tnc data", response.data);

      return response?.data?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to single app Tnc data");
    }
  }
);


//create Terms and condtions
export const createAppTnc = createAsyncThunk(
  "appTncSlice/createAppTnc",
  async (data) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        console.log("'Access token not found in localStorage'");
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/app-terms-and-conditions`;

      const response = await axiosInstance.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("create app Tnc data", response.data);

      return response?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to create app Tnc data");
    }
  }
);


//update Terms and condtions
export const updateAppTnc = createAsyncThunk(
  "appTncSlice/updateAppTnc",
  async ({ id, data }) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        console.log("'Access token not found in localStorage'");
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/app-terms-and-conditions/${id}`;

      const response = await axiosInstance.patch(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("update app Tnc data", response.data);

      return response?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to update app Tnc data");
    }
  }
);


//delete Terms and condtions
export const deleteAppTnc = createAsyncThunk(
  "appTncSlice/deleteAppTnc",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        console.log("'Access token not found in localStorage'");
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/app-terms-and-conditions/${id}`;

      const response = await axiosInstance.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // console.log("delete app Tnc data", response.data);

      return id;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to delete app Tnc data");
    }
  }
);



export const appTncSlice = createSlice({
  name: 'appTnc',
  initialState: {
    allAppTnc:[],
    singleAppTnc:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getAppTnc.fulfilled, (state, action) => {
      state.allAppTnc = action.payload 
    })
    .addCase(getSingleAppTnc.fulfilled, (state, action) => {
      state.singleAppTnc= action.payload
    })
    .addCase(createAppTnc.fulfilled, (state, action) => {
      state.allAppTnc.push(action.payload)
    })
    .addCase(updateAppTnc.fulfilled, (state, action) => {
      const index = state.allAppTnc.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.allAppTnc[index] = action.payload;
      }
      state.singleAppTnc = action.payload;
    })
    .addCase(deleteAppTnc.fulfilled, (state, action) => {
      state.allAppTnc = state.allAppTnc.filter(item => item.id !== action.payload);
    })
  } 
})

export default appTncSlice.reducer