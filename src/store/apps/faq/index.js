import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all Faq

export const getFaq = createAsyncThunk('appFaqSlice/getFaq', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v2/frequently-asked-questions`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all frequently-asked-questions")
    throw new Error('Failed to fetch all the frequently-asked-questions')
  }
})


//Review the FAQ
export const reviewFaq = createAsyncThunk('appFaqSlice/reviewFaq', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
    console.log("req", req)
  
    let url = `${ip}/v2/frequently-asked-questions/${req.id}/review`
    
    const response = await axiosInstance.patch(url, req.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      } 
    })
    
    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to review frequently-asked-questions details')
  }
})

//get single add-on
export const getSingleFaq = createAsyncThunk('appFaqSlice/getSingleFaq', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      console.log("'Access token not found in localStorage'")
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v2/frequently-asked-questions/${id}`

    const response = await axiosInstance.get(url,id, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    console.log("single frequently-asked-questions data", response.data)

    return response?.data?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to single frequently-asked-questions data')
  }
})



export const appFaqSlice = createSlice({
  name: 'appFaq',
  initialState: {
    allFaq:[],
    singleFaq:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getFaq.fulfilled, (state, action) => {
      state.allFaq = action.payload 
    })

    .addCase(reviewFaq.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(getSingleFaq.fulfilled, (state, action) => {
      state.singleFaq= action.payload
    }) 
  } 
})

export default appFaqSlice.reducer
