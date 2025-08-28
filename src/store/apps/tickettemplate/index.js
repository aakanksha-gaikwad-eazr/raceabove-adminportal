import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all Ticket Templates

export const getTicketTemplate = createAsyncThunk(
  "appTicketTemplate/getTicketTemplate",
  async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v2/ticket-templates`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch all ticket-types");
      throw new Error("Failed to fetch all the ticket-types");
    }
  }
);

//review the Ticket Templates
export const reviewTicketTemplate = createAsyncThunk(
  "appTicketTemplate/reviewTicketTemplate",
  async (req) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      console.log("req review", req);

      let url = `${ip}/v2/ticket-templates/${req.id}/review`;

      const response = await axiosInstance.patch(url, req.data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("review TicketTemplate data", response.data);

      return response?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to review TicketTemplate details");
    }
  }
);

//get single add-on
export const getSingleTicketTemplate = createAsyncThunk(
  "appTicketTemplate/getSingleTicketTemplate",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        console.log("'Access token not found in localStorage'");
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/ticket-templates/${id}`;

      const response = await axiosInstance.get(url, id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("single TicketTemplate data", response.data);

      return response?.data?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to single TicketTemplate data");
    }
  }
);



export const appTicketTemplateSlice = createSlice({
  name: 'appTicketTemplate',
  initialState: {
    allTicketTemplate:[],
    singleTicketTemplate:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getTicketTemplate.fulfilled, (state, action) => {
      state.allTicketTemplate = action.payload 
    })
    .addCase(reviewTicketTemplate.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(getSingleTicketTemplate.fulfilled, (state, action) => {
      state.singleTicketTemplate= action.payload
    })
  }
})

export default appTicketTemplateSlice.reducer
