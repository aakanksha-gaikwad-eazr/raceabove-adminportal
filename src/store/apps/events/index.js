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

//delete challenge
export const deleteEvents = createAsyncThunk('appEventsSlice/deleteEvents', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    console.log("accessToken",accessToken)
    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/events/${id}`
    const response = await axiosInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    // console.log("deleted events data", response)

    return response.data

  } catch (error) {
    console.log("Failed to delete events")
    throw new Error('Failed to delete events')
  }
})

//create challenge
export const createEvents = createAsyncThunk('appEventsSlice/createEvents', async (data) => {
  // console.log("data", data)
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    // console.log("accessToken",accessToken)

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/events`

    console.log("data", data)

    const response = await axiosInstance.post(url,data, {

      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    console.log("created events data", response)

    return response.data

  } catch (error) {
    console.log("Failed to create events")
    throw new Error('Failed to create events')
  }
})


export const appEventsSlice = createSlice({
  name: 'appEvents',
  initialState: {
    events:[],
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
      state.events = action.payload 
    })
    .addCase(getEvents.rejected, (state) => {
      state.isLoading = false
    })

    .addCase(getEventsById.fulfilled, (state, action) => {
        state.singleEvents = action.payload
    })
    .addCase(createEvents.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteEvents.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateEvents.fulfilled, (state, action) => {
      state.success = true
    })
  }
})

export default appEventsSlice.reducer
