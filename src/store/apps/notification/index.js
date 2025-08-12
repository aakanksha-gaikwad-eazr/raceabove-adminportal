import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'
// import { ip } from 'config/config'

//** fetch all employee

export const getNotification = createAsyncThunk('appNotification/getNotification', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken


    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v2/notifications`;

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })


    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all notification")
    throw new Error('Failed to fetch all the notification')
  }
})

//add user
export const createNotification = createAsyncThunk(
  "appNotification/createNotification",
  async (data) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/notifications`;

      const response = await axiosInstance.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("created user data", response)

      return response?.data;
    } catch (error) {
      console.error(
        "❌ API Request Failed:",
        error.response?.data || error.message
      );
      throw new Error("Failed to Create notification");
    }
  }
);



export const appNotificationSlice = createSlice({
  name: 'appNotification',
  initialState: {
    notification: [],
    status:false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getNotification.fulfilled, (state, action) => {
        state.notification = action.payload;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.status = true;
      });

    
  }
})

export default appNotificationSlice.reducer
