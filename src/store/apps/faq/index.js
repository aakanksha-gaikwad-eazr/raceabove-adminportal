import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all Tickettype

export const getFaq = createAsyncThunk('appFaqSlice/getFaq', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/frequently-asked-questions`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all frequently-asked-questions")
    throw new Error('Failed to fetch all the frequently-asked-questions')
  }
})

//add addons
export const createFaq = createAsyncThunk('appFaqSlice/createFaq', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    let url = `${ip}/v1/frequently-asked-questions`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    // console.log("created frequently-asked-questions data", response)
    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create frequently-asked-questions')
  }
})

//delete addons
export const deleteFaq = createAsyncThunk('appFaqSlice/deleteFaqs', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    const url = `${ip}/v1/frequently-asked-questions/${id}`

    const response = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    console.log('deleted the frequently-asked-questions', response.data)

    return response.data
  } catch (error) {
    console.log("Couldn't delete frequently-asked-questions", error)
    throw error;
  }
})

//update the addons
export const updateFaq = createAsyncThunk('appFaqSlice/updateFaq', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/frequently-asked-questions/${req.id}`
    
    const response = await axiosInstance.patch(url, req.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      } 
    })
    
    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update frequently-asked-questions details')
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
  
    let url = `${ip}/v1/frequently-asked-questions/${id}`

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
    faq:[],
    singleFaq:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getFaq.fulfilled, (state, action) => {
      state.faq = action.payload 
    })
    .addCase(createFaq.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteFaq.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateFaq.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(getSingleFaq.fulfilled, (state, action) => {
      state.singleFaq= action.payload
    }) 
  } 
})

export default appFaqSlice.reducer
