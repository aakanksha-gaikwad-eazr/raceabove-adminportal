import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all Tickettype

export const getTicketTemplate = createAsyncThunk('appTicketTemplate/getTicketTemplate', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/ticket-templates`

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
export const createTicketTemplate = createAsyncThunk('appTicketTemplate/createTicketTemplate', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    let url = `${ip}/v1/ticket-templates`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    console.log("created TicketTemplate data", response)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create addons')
  }
})

//delete addons
export const deleteTicketTemplate = createAsyncThunk('appTicketTemplate/deleteTicketTemplates', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    const url = `${ip}/v1/ticket-templates/${id}`

    const response = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    console.log('deleted the TicketTemplate', response.data)

    return response.data
  } catch (error) {
    console.log("Couldn't delete TicketTemplate", error)
    throw error;
  }
})

//update the addons
export const updateTicketTemplate = createAsyncThunk('appTicketTemplate/updateTicketTemplate', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
    console.log("req update", req)
  
    let url = `${ip}/v1/ticket-templates/${req.id}`
    
    const response = await axiosInstance.patch(url, req.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      } 
    })
    
    console.log("update TicketTemplate data", response.data)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update TicketTemplate details')
  }
})

//get single add-on
export const getSingleTicketTemplate = createAsyncThunk('appTicketTemplate/getSingleTicketTemplate', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      console.log("'Access token not found in localStorage'")
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/ticket-templates/${id}`

    const response = await axiosInstance.get(url,id, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    console.log("single TicketTemplate data", response.data)

    return response?.data?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to single TicketTemplate data')
  }
})



export const appTicketTemplateSlice = createSlice({
  name: 'appTicketTemplate',
  initialState: {
    ticketTemplate:[],
    singleTicketTemplate:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getTicketTemplate.fulfilled, (state, action) => {
      state.ticketTemplate = action.payload 
    })
    .addCase(createTicketTemplate.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteTicketTemplate.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateTicketTemplate.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(getSingleTicketTemplate.fulfilled, (state, action) => {
      state.singleTicketTemplate= action.payload
    })
  }
})

export default appTicketTemplateSlice.reducer
