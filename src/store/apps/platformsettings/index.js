import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all PlatformSettings

export const getPlatformSettings = createAsyncThunk('appPlatformSettings/getPlatformSettings', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v2/settings`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })
    console.log("res:::", response)

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all platform settings")
    throw new Error('Failed to fetch all the platform settings')
  }
})

//add user
export const createPlatformSettings = createAsyncThunk('appPlatformSettings/createPlatformSettings', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

  
    let url = `${ip}/v2/settings`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    console.log("created user data", response)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create create Settings details')
  }
})

//update the user
export const updatePlatformSettings = createAsyncThunk('appPlatformSettings/updatePlatformSettings', async (req) => {
  console.log("data:::", req)
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    // console.log("accessToken",accessToken)

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v2/settings`
    console.log(req,"req")

    const response = await axiosInstance.patch(url,req?.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
        'Content-Type': 'multipart/form-data',
      } 
    })
    
    console.log("update settings data", response.data)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update settings details')
  }
})



export const appPlatformSettingsSlice = createSlice({
  name: 'appPlatformSettings',
  initialState: {
    settings:[]  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getPlatformSettings.fulfilled, (state, action) => {
      state.settings = action.payload 
    })
    .addCase(createPlatformSettings.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updatePlatformSettings.fulfilled, (state, action) => {
      state.success = true
    })
  }
})

export default appPlatformSettingsSlice.reducer
