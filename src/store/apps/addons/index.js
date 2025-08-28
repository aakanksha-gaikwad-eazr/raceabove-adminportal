import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all addons
export const getAddOns = createAsyncThunk(
  "appAddOns/getAddOns",
  async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/products`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch all add-ons");
      throw new Error("Failed to fetch all the add-ons");
    }
  }
);

//review the addons
export const reviewAddOns = createAsyncThunk(
  "appAddOns/reviewAddOns",
  async (req) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;
      console.log("request here", req);
      console.log("FormData contents:", req.data);

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/products/${req.id}/review`;

      const response = await axiosInstance.patch(url, req.data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("review addons data", response.data);

      return response?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to review addons details");
    }
  }
);

//get single add-on
export const singleAddOn = createAsyncThunk(
  "appAddOns/singleAddOn",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        console.log("'Access token not found in localStorage'");
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/products/${id}`;

      const response = await axiosInstance.get(url, id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("single add on data", response.data);

      return response?.data?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to single add on data");
    }
  }
);



export const appAddOnsSlice = createSlice({
  name: 'appTicketType',
  initialState: {
    allAddOns:[],
    singleAddOns:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getAddOns.fulfilled, (state, action) => {
      state.allAddOns = action.payload 
    })
  
    .addCase(reviewAddOns.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(singleAddOn.fulfilled, (state, action) => {
      state.singleAddOns= action.payload
    })
  }
})

export default appAddOnsSlice.reducer
