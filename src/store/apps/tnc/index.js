import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all Tickettype

export const getTnc = createAsyncThunk('appTncSlice/getTnc', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/terms-and-conditions`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all terms-and-conditions")
    throw new Error('Failed to fetch all the terms-and-conditions')
  }
})

//add addons
export const createTnc = createAsyncThunk('appTncSlice/createTnc', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    let url = `${ip}/v1/terms-and-conditions`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    console.log("created tnc data", response)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create tnc')
  }
})

//delete addons
export const deleteTnc = createAsyncThunk('appTncSlice/deleteTnc', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    const url = `${ip}/v1/terms-and-conditions/${id}`

    const response = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    console.log('deleted the Tnc', response.data)

    return response.data
  } catch (error) {
    console.log("Couldn't delete Tnc", error)
    throw error;
  }
})

//update the addons
export const updateTnc = createAsyncThunk('appTncSlice/updateTnc', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/terms-and-conditions/${req.id}`
    
    const response = await axiosInstance.patch(url, req.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      } 
    })
    
    console.log("update Tnc data", response.data)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update Tnc details')
  }
})

//get single add-on
export const getSingleTnc = createAsyncThunk('appTncSlice/getSingleTnc', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      console.log("'Access token not found in localStorage'")
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/terms-and-conditions/${id}`

    const response = await axiosInstance.get(url,id, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    console.log("single Tnc data", response.data)

    return response?.data?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to single Tnc data')
  }
})



export const appTncSlice = createSlice({
  name: 'appTnc',
  initialState: {
    allTnc:[],
    singleTnc:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getTnc.fulfilled, (state, action) => {
      state.allTnc = action.payload 
    })
    .addCase(createTnc.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteTnc.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateTnc.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(getSingleTnc.fulfilled, (state, action) => {
      state.singleTnc= action.payload
    }) 
  } 
})

export default appTncSlice.reducer
