import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all users

export const getEvents = createAsyncThunk('appEventsSlice/getEvents', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/events`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all events")
    throw new Error('Failed to fetch all events')
  }
})

export const getEventsById = createAsyncThunk('appEventsSlice/getEventsById', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    // console.log("adminData", adminData)
    // console.log("token", accessToken)

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }

    let url = `${ip}/v1/events/${id}`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })
    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all events")
    throw new Error('Failed to fetch all events')
  }
})

//add events
export const createEvents = createAsyncThunk('appEventsSlice/createEvents', async (data) => {
  console.log("data:::", data)
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/events`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    console.log("created events data", response)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create events details')
  }
})


// //update challenge
export const updateEvents = createAsyncThunk('appEventsSlice/updateEvents', async (req, { rejectWithValue }) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    console.log("req",req)

    const url = `${ip}/v1/events/${req?.id}`

    const response = await axiosInstance.patch(url, req?.changedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error('Update event error:', error.response?.data || error.message)
    return rejectWithValue(error.response?.data || { message: 'Failed to update event' })
  }
})

// //review challenge
export const reviewEvents = createAsyncThunk('appEventsSlice/reviewEvents', async (req, { rejectWithValue }) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    console.log("req",req)

    const url = `${ip}/v1/events/${req?.id}/review`

    const response = await axiosInstance.patch(url, req?.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data
  } catch (error) {
    console.error('reivew event error:', error.response?.data || error.message)
    return rejectWithValue(error.response?.data || { message: 'Failed to reivew event' })
  }
})




export const appEventsSlice = createSlice({
  name: 'appEvents',
  initialState: {
    allEvents:[],
    singleEvents:[],
    isLoading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getEvents.pending, (state) => {
      state.isLoading = true
    })
    .addCase(getEvents.fulfilled, (state, action) => {
      state.isLoading = false
      state.allEvents = action.payload 
    })
    .addCase(getEvents.rejected, (state) => {
      state.isLoading = false
    })

    .addCase(getEventsById.fulfilled, (state, action) => {
        state.singleEvents = action.payload
    })
    .addCase(updateEvents.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(reviewEvents.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(createEvents.fulfilled, (state, action) => {
      state.success = true
    })
  }
})

export default appEventsSlice.reducer
