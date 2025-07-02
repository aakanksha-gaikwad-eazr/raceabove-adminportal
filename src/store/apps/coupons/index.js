import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all coupons

export const getCoupons = createAsyncThunk('appCouponsSlice/getCoupons', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/coupons`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })
    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all coupons")
    throw new Error('Failed to fetch all coupons')
  }
})

export const getCouponsById = createAsyncThunk('appCouponsSlice/getCouponsById', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }

    let url = `${ip}/v1/coupons/${id}`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch a coupon")
    throw new Error('Failed to fetch a coupon')
  }
})

//create / add coupons
export const createCoupon = createAsyncThunk('appCouponsSlice/createCoupon', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    console.log("accessToken",accessToken)

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/coupons`

    const response = await axiosInstance.post(url,data, {

      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    return response.data 

  } catch (error) {
    console.log("Failed to create  coupons")
    throw new Error('Failed to create coupons')
  }
})

// //delete coupons
export const deleteCoupons = createAsyncThunk('appCouponsSlice/deleteCoupons', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken
    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/coupons/${id}`
    const response = await axiosInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    return response.data

  } catch (error) {
    console.log("Failed to delete coupons")
    throw new Error('Failed to delete coupons')
  }
})

// //update coupons
export const updateCoupons = createAsyncThunk('appCouponsSlice/updateCoupons', async (req, { rejectWithValue }) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    const url = `${ip}/v1/coupons/${req?.editId}`
    
    const response = await axiosInstance.patch(url, req?.changedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error) {
    console.error('Update coupon error:', error.response?.data || error.message)
    return rejectWithValue(error.response?.data || { message: 'Failed to update coupon' })
  }
})


export const appCouponsSlice = createSlice({
  name: 'appCoupons',
  initialState: {
    coupons:[],
    singleCoupons:[]
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getCoupons.fulfilled, (state, action) => {
      state.coupons = action.payload 
    })
    .addCase(getCouponsById.fulfilled, (state, action) => {
        state.singleCoupons = action.payload
    })
    .addCase(createCoupon.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteCoupons.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateCoupons.fulfilled, (state, action) => {
      state.success = true
    })
  }
})

export default appCouponsSlice.reducer
