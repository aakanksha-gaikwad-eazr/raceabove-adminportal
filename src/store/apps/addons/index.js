import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all addons

export const getAddOns = createAsyncThunk('appAddOns/getAddOns', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/products`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all add-ons")
    throw new Error('Failed to fetch all the add-ons')
  }
})

//add addons
export const createAddOns = createAsyncThunk('appAddOns/createAddOns', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    let url = `${ip}/v1/products`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    console.log("created addons data", response)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create addons')
  }
})

//delete addons
export const deleteAddOns = createAsyncThunk('appAddOns/deleteAddOns', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    const url = `${ip}/v1/products/${id}`

    const response = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    console.log('deleted the add-on', response.data)

    return response.data
  } catch (error) {
    console.log("Couldn't delete addon", error)
    throw error;
  }
})

//update the addons
export const updateAddOns = createAsyncThunk('appAddOns/updateAddOns', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken
    console.log("request here", req)
    console.log("FormData contents:", req.data)

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/products/${req.id}`
    
    const response = await axiosInstance.patch(url, req.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      } 
    })
    
    console.log("update addons data", response.data)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update addons details')
  }
})

//get single add-on
export const singleAddOn = createAsyncThunk('appAddOns/singleAddOn', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      console.log("'Access token not found in localStorage'")
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/products/${id}`

    const response = await axiosInstance.get(url,id, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    console.log("single add on data", response.data)

    return response?.data?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to single add on data')
  }
})



export const appAddOnsSlice = createSlice({
  name: 'appTicketType',
  initialState: {
    addOns:[],
    singleAddOns:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getAddOns.fulfilled, (state, action) => {
      state.addOns = action.payload 
    })
    .addCase(createAddOns.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteAddOns.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateAddOns.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(singleAddOn.fulfilled, (state, action) => {
      state.singleAddOns= action.payload
    })
  }
})

export default appAddOnsSlice.reducer
