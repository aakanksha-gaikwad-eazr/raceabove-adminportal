import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all sports
export const getGearTypes = createAsyncThunk(
  "appSports/gearTypes",
  async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/gear-types`;

      const response = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch all gear-types");
      throw new Error("Failed to fetch all the gear-types");
    }
  }
);

//fetch sports by id
export const getGearTypesById = createAsyncThunk(
  "appSports/getGearTypesById",
  async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/gear-types`;

      const response = await axiosInstance.get(url, {
        "Content-Type": "multipart/form-data",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch a gear-types");
      throw new Error("Failed to fetch a the gear-types");
    }
  }
);

//add sports
export const createGearTypes = createAsyncThunk(
  "appUsers/createGearTypes",
  async (data) => {
    console.log("data:::", data);
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/gear-types`;
      console.log("🌍 API URL:", url);

      console.log("data create gear", data);

      const response = await axiosInstance.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("created gear-types data", response);

      return response?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to Create gear-types details");
    }
  }
);

export const deleteGearTypes = createAsyncThunk(
  "appUsers/deleteGearTypes",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      const url = `${ip}/v2/gear-types/${id}`;

      const response = await axiosInstance.delete(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("deleted the gear-types", response.data);

      return response.data;
    } catch (error) {
      console.log("Couldn't delete gear-types", error);
      throw error;
    }
  }
);


//update the gear types
export const updateGearTypes = createAsyncThunk(
  "appUsers/updateGearTypes",
  async (req, { rejectWithValue }) => {
    console.log("data:::", req);
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/gear-types/${req.id}`;
      console.log(req?.data, "req?.data gear-types");

      const response = await axiosInstance.patch(url, req?.data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("update gear-types data", response.data);

      // Return the response data with status information
      return {
        ...response.data,
        status: response.status,
        statusCode: response.status,
        id: req.id, // Include the ID for easy identification
      };
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );

      // Return rejected value with proper error information
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Failed to update gear-types details",
        status: error.response?.status || 500,
        data: error.response?.data,
      });
    }
  }
);

export const appGearTypesSlice = createSlice({
  name: 'appGearTypes',
  initialState: {
    gearTypes:[], 
    singleGearTypes:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getGearTypes.fulfilled, (state, action) => {
      state.gearTypes = action.payload 
    })
     .addCase(getGearTypesById.fulfilled, (state, action) => {
          state.singleGearTypes = action.payload 
        })
        .addCase(createGearTypes.fulfilled, (state, action) => {
          state.success = true
        })
        .addCase(deleteGearTypes.fulfilled, (state, action) => {
          state.success = true
        })
        .addCase(updateGearTypes.fulfilled, (state, action) => {
          state.success = true
        })
  }
})

export default appGearTypesSlice.reducer
