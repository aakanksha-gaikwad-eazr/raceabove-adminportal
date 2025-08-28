import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all PrivacyPolicies
export const getPrivacyPolicies = createAsyncThunk(
  "appPrivacyPoliciesSlice/getPrivacyPolicies",
  async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/privacy-policies`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch all PrivacyPolicies");
      throw new Error("Failed to fetch all the PrivacyPolicies");
    }
  }
);

//review the PrivacyPolicies
export const reviewPrivacyPolicies = createAsyncThunk(
  "appPrivacyPoliciesSlice/reviewPrivacyPolicies",
  async (req) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/privacy-policies/${req.id}/review`;

      const response = await axiosInstance.patch(url, req.data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("review PrivacyPolicies data", response.data);

      return response?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to review PrivacyPolicies details");
    }
  }
);

//get single PrivacyPolicies
export const getSinglePrivacyPolicies = createAsyncThunk(
  "appPrivacyPoliciesSlice/getSinglePrivacyPolicies",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        console.log("'Access token not found in localStorage'");
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/privacy-policies/${id}`;

      const response = await axiosInstance.get(url, id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("single PrivacyPolicies data", response.data);

      return response?.data?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to single PrivacyPolicies data");
    }
  }
);



export const appPrivacyPolicySlice = createSlice({
  name: 'appTnc',
  initialState: {
    privacypolicies:[],
    singlePrivacypolicies:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getPrivacyPolicies.fulfilled, (state, action) => {
      state.privacypolicies = action.payload 
    })
    .addCase(reviewPrivacyPolicies.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(getSinglePrivacyPolicies.fulfilled, (state, action) => {
      state.singlePrivacypolicies= action.payload
    }) 
  } 
})

export default appPrivacyPolicySlice.reducer

