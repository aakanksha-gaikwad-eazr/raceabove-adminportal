import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all sports
export const getSports = createAsyncThunk('appSports/getSports', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/sports`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all sports")
    throw new Error('Failed to fetch all the sports')
  }
})

//fetch sports by id
export const getSportsById = createAsyncThunk('appSports/getSportsById', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/sports/${id}`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch sport by id")
    throw new Error('Failed to fetch the sport')
  }
})

//add sports
export const createSports = createAsyncThunk('appSports/createSports', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/sports`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create sports details')
  }
})


export const deleteSports = createAsyncThunk('appSports/deleteSports', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    const url = `${ip}/v1/sports/${id}`

    const response = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    console.log("res del", response)
    return response.data
    
  } catch (error) {
    console.log("Couldn't delete sports", error)
    throw error;
  }
})

//update the sports
export const updateSports = createAsyncThunk('appSports/updateSports', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/sports/${req.id}`
    console.log("req", req)

    const response = await axiosInstance.patch(url,req?.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update sports details')
  }
})

export const appSportsSlice = createSlice({
  name: 'appSports',
  initialState: {
    sports:[],
    singleSports:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getSports.fulfilled, (state, action) => {
      state.sports = action.payload 
    })
     .addCase(getSportsById.fulfilled, (state, action) => {
          state.singleSports = action.payload 
        })
        .addCase(createSports.fulfilled, (state, action) => {
          state.success = true
        })
        .addCase(deleteSports.fulfilled, (state, action) => {
          state.success = true
        })
        .addCase(updateSports.fulfilled, (state, action) => {
          state.success = true
        })
  }
})

export default appSportsSlice.reducer
