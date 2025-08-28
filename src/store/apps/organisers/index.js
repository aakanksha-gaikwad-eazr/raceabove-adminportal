import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'
import toast from 'react-hot-toast'


//** fetch all organisers
export const getOrganizers = createAsyncThunk(
  "appOrganizers/getOrganizers",
  async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/organizers`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch all organizers");
      throw new Error("Failed to fetch all the organizers");
    }
  }
);

//** fetch single organizer
export const getSingleOrganizers = createAsyncThunk(
  "appOrganizers/getSingleOrganizers",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/organizers/${id}`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch single organizers");
      throw new Error("Failed to fetch single the organizers");
    }
  }
);

//add organizer
export const createOrganizer = createAsyncThunk(
  "appOrganizers/createOrganizer",
  async (formData) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      // console.log("accessToken",accessToken)

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/organizers`;

      console.log("data>>", formData);
      const response = await axiosInstance.post(url, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // 'Content-Type': 'multipart/form-data',
        },
      });

      console.log("response organis", response);
      return response?.data;
    } catch (error) {
      console.log("erw", error);
      console.error(
        "❌ API Request Failed:",
        error.response?.data.message
      );
      // throw new Error('Failed to Create Organizer details')
      toast.error(error.response?.data.message);
    }
  }
);

//delete organizer
export const deleteOrganizer = createAsyncThunk(
  "appOrganizers/deleteOrganizer",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      const url = `${ip}/v2/organizers/${id}`;

      const response = await axiosInstance.delete(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      console.log("Couldn't delete organizer", error);
      throw error;
    }
  }
);

//update the organizer
export const updateOrganizer = createAsyncThunk(
  "appOrganizers/updateOrganizer",
  async (req) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/organizers/${req.editId}`;

      const response = await axiosInstance.patch(
        url,
        req?.changedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response?.data;
    } catch (error) {
      console.error(
        "❌ organizer update Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to update organizer details");
    }
  }
);



export const appOrganizersSlice = createSlice({
  name: 'appOrganizers',
  initialState: {
    allOrganisers:[],
    singleOrganizer:{},
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getOrganizers.fulfilled, (state, action) => {
      state.allOrganisers = action.payload 
    })
    .addCase(getSingleOrganizers.fulfilled, (state, action) => {
      state.singleOrganizer = action.payload 
    })
    .addCase(createOrganizer.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteOrganizer.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateOrganizer.fulfilled, (state, action) => {
      state.success = true
    })
  }
})

export default appOrganizersSlice.reducer
