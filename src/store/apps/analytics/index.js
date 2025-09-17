import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all addons
export const getAnalytics = createAsyncThunk(
  "appAnalytics/getAnalytics",
  async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/analytics`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      console.log("Failed to fetch all analytics");
      throw new Error("Failed to fetch all the analytics");
    }
  }
);

export const appAnalyticsSlice = createSlice({
  name: 'appAnalytics',
   initialState: {
    allAnalytics: {},       
    analyticsData: {},      
    financeData: {}         
  },
  reducers: {},
extraReducers: builder => {
    builder.addCase(getAnalytics.fulfilled, (state, action) => {
      state.allAnalytics = action.payload;

      const {
        organizersProfileOverviews,
        eventsOverview,
        couponsAndDiscounts,
        challengesManagement,
        financialSummaryDashboard
      } = action.payload;

      state.analyticsData = {
        organizersProfileOverviews,
        eventsOverview,
        couponsAndDiscounts,
        challengesManagement
      };
      state.financeData = financialSummaryDashboard;
    });
  }
})

export default appAnalyticsSlice.reducer
