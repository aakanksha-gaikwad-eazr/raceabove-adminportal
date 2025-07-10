import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all addons

export const getAddOnsCategory = createAsyncThunk('appAddOns/getAddOnsCategory', async () => {  
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/product-categories`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })
    console.log("addons res:::", response)

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all add-ons-categories")
    throw new Error('Failed to fetch all the add-ons-categories')
  }
})

//add addons
export const createAddOnsCategory = createAsyncThunk('appAddOns/createAddOnsCategory', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    let url = `${ip}/v1/product-categories`

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
export const deleteAddOnsCategory = createAsyncThunk('appAddOns/deleteAddOnsCategory', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    const url = `${ip}/v1/product-categories/${id}`

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
export const updateAddOnsCategory = createAsyncThunk('appAddOns/updateAddOnsCategory', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/product-categories/${req.id}`
    console.log(req?.data,"req?.data")

    const response = await axiosInstance.patch(url,req?.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    console.log("update addons data", response.data)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update addons details')
  }
})

//update the addons
export const reviewAddOnsCategory = createAsyncThunk('appAddOns/reviewAddOnsCategory', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/product-categories/${req.id}/review`
    console.log(req?.data,"req?.data")

    const response = await axiosInstance.patch(url,req?.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    console.log("Review Product Category", response.data)

    return response?.data

  } catch (error) {
    console.error("❌ Product Category Review Failed:", error.response?.data || error.message);
    throw new Error('Failed to Review Product Category')
  }
})

//get single add-on
export const singleAddOnCategory = createAsyncThunk('appAddOns/singleAddOnCategory', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      console.log("'Access token not found in localStorage'")
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/product-categories/${id}`

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
    addOnsCategory:[],
    singleAddOnsCategory:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getAddOnsCategory.fulfilled, (state, action) => {
      state.addOnsCategory = action.payload 
    })
    .addCase(createAddOnsCategory.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteAddOnsCategory.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateAddOnsCategory.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(singleAddOnCategory.fulfilled, (state, action) => {
      state.singleAddOnsCategory= action.payload
    })
    .addCase(reviewAddOnsCategory.fulfilled, (state, action) => {
      state.singleAddOnsCategory= true
    })
  }
})

export default appAddOnsSlice.reducer
