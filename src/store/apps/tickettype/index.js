import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all Tickettype

export const getTicketType = createAsyncThunk('appTicketType/getTicketType', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/ticket-types`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all ticket-types")
    throw new Error('Failed to fetch all the ticket-types')
  }
})

//add addons
export const createTicketType = createAsyncThunk('appTicketType/createTicketType', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    let url = `${ip}/v1/ticket-types`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    console.log("created ticket-types data", response)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create addons')
  }
})

//delete addons
export const deleteTicketType = createAsyncThunk('appTicketType/deleteTicketTypes', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    const url = `${ip}/v1/ticket-types/${id}`

    const response = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    console.log('deleted the ticket-types', response.data)

    return response.data
  } catch (error) {
    console.log("Couldn't delete ticket-types", error)
    throw error;
  }
})

//update the addons
export const updateTicketTypes = createAsyncThunk('appTicketType/updateTicketTypes', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/ticket-types/${req.editId}`
    
    const response = await axiosInstance.patch(url, req.changedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      } 
    })
    
    console.log("update ticket-types data", response.data)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update ticket-types details')
  }
})

//get single add-on
export const getSingleTicketType = createAsyncThunk('appTicketType/getSingleTicketType', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      console.log("'Access token not found in localStorage'")
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/ticket-types/${id}`

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    

    return response?.data?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to single ticket-type data')
  }
})



export const appTicketTypeSlice = createSlice({
  name: 'appTicketType',
  initialState: {
    tickettypes:[],
    singleTicketType:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getTicketType.fulfilled, (state, action) => {
      state.tickettypes = action.payload 
    })
    .addCase(createTicketType.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteTicketType.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateTicketTypes.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(getSingleTicketType.fulfilled, (state, action) => {
      state.singleTicketType= action.payload
    })
  }
})

export default appTicketTypeSlice.reducer
