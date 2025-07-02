import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all Tickettype

export const getPrivacyPolicies = createAsyncThunk('appPrivacyPoliciesSlice/getPrivacyPolicies', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/privacy-policies`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all PrivacyPolicies")
    throw new Error('Failed to fetch all the PrivacyPolicies')
  }
})

//add addons
export const createPrivacyPolicies = createAsyncThunk('appPrivacyPoliciesSlice/createPrivacyPolicies', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    let url = `${ip}/v1/privacy-policies`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    console.log("created PrivacyPolicies data", response)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create PrivacyPolicies')
  }
})

//delete addons
export const deletePrivacyPolicies= createAsyncThunk('appPrivacyPolicieslice/deletePrivacyPolicies', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    const url = `${ip}/v1/privacy-policies/${id}`

    const response = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    console.log('deleted the PrivacyPolicies', response.data)

    return response.data
  } catch (error) {
    console.log("Couldn't delete PrivacyPolicies", error)
    throw error;
  }
})

//update the addons
export const updatePrivacyPolicies = createAsyncThunk('appPrivacyPoliciesSlice/updatePrivacyPolicies', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/privacy-policies/${req.id}`
    
    const response = await axiosInstance.patch(url, req.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      } 
    })
    
    console.log("update PrivacyPolicies data", response.data)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update PrivacyPolicies details')
  }
})

//get single add-on
export const getSinglePrivacyPolicies = createAsyncThunk('appPrivacyPoliciesSlice/getSinglePrivacyPolicies', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      console.log("'Access token not found in localStorage'")
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/privacy-policies/${id}`

    const response = await axiosInstance.get(url,id, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    console.log("single PrivacyPolicies data", response.data)

    return response?.data?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to single PrivacyPolicies data')
  }
})



export const appPrivacyPolicySlice = createSlice({
  name: 'appTnc',
  initialState: {
    privacypolicies:[],
    singlePrivacypolicies:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getPrivacyPolicies.fulfilled, (state, action) => {
      state.privacypolicies = action.payload 
    })
    .addCase(createPrivacyPolicies.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deletePrivacyPolicies.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updatePrivacyPolicies.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(getSinglePrivacyPolicies.fulfilled, (state, action) => {
      state.singlePrivacypolicies= action.payload
    }) 
  } 
})

export default appPrivacyPolicySlice.reducer

