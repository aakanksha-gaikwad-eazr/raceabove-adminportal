import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from "../../../config/config";

// 🔹 Fetch all App PrivacyPolicies
export const getAppPrivacyPolicies = createAsyncThunk(
  "appPrivacyPoliciesSlice/getAppPrivacyPolicies",
  async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/app-privacy-policies`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch all App PrivacyPolicies");
      throw new Error("Failed to fetch all the App PrivacyPolicies");
    }
  }
);

// 🔹 Fetch single App PrivacyPolicy by ID
export const getSingleAppPrivacyPolicies = createAsyncThunk(
  "appPrivacyPoliciesSlice/getSingleAppPrivacyPolicies",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/app-privacy-policies/${id}`;

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response?.data?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch single App PrivacyPolicy");
    }
  }
);

// 🔹 Create App PrivacyPolicy
export const createAppPrivacyPolicy = createAsyncThunk(
  "appPrivacyPoliciesSlice/createAppPrivacyPolicy",
  async (payload) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/app-privacy-policies`;

      const response = await axiosInstance.post(url, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Failed to create App PrivacyPolicy", error.response?.data || error.message);
      throw new Error("Failed to create App PrivacyPolicy");
    }
  }
);

// 🔹 Update App PrivacyPolicy (PATCH)
export const updateAppPrivacyPolicy = createAsyncThunk(
  "appPrivacyPoliciesSlice/updateAppPrivacyPolicy",
  async ({ id, data }) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/app-privacy-policies/${id}`;

      const response = await axiosInstance.patch(url, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Failed to update App PrivacyPolicy", error.response?.data || error.message);
      throw new Error("Failed to update App PrivacyPolicy");
    }
  }
);

// 🔹 Delete App PrivacyPolicy
export const deleteAppPrivacyPolicy = createAsyncThunk(
  "appPrivacyPoliciesSlice/deleteAppPrivacyPolicy",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/app-privacy-policies/${id}`;

      await axiosInstance.delete(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return id; // return id so we can remove it from state
    } catch (error) {
      console.error("❌ Failed to delete App PrivacyPolicy", error.response?.data || error.message);
      throw new Error("Failed to delete App PrivacyPolicy");
    }
  }
);

// 🔹 Slice
export const appPrivacyPolicySlice = createSlice({
  name: "appPrivacyPoliciesSlice",
  initialState: {
    appprivacypolicies: [],
    singleAppPrivacypolicies: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET all
      .addCase(getAppPrivacyPolicies.fulfilled, (state, action) => {
        state.appprivacypolicies = action.payload;
      })
      // GET single
      .addCase(getSingleAppPrivacyPolicies.fulfilled, (state, action) => {
        state.singleAppPrivacypolicies = action.payload;
      })
      // CREATE
      .addCase(createAppPrivacyPolicy.fulfilled, (state, action) => {
        state.appprivacypolicies.push(action.payload);
      })
      // UPDATE
      .addCase(updateAppPrivacyPolicy.fulfilled, (state, action) => {
        const index = state.appprivacypolicies.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.appprivacypolicies[index] = action.payload;
        }
      })
      // DELETE
      .addCase(deleteAppPrivacyPolicy.fulfilled, (state, action) => {
        state.appprivacypolicies = state.appprivacypolicies.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default appPrivacyPolicySlice.reducer;
