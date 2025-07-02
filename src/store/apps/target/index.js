import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all targets
export const getTargets = createAsyncThunk('appTargets/getTargets', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/targets`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })
    
    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all targets")
    throw new Error('Failed to fetch all the targets')
  }
})

export const getTargetById = createAsyncThunk('appTargets/getTargetById', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/targets/${id}`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch single target")
    throw new Error('Failed to fetch single the target')
  }
})

export const createTarget = createAsyncThunk('appTargets/createTargets', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/targets`

    const response = await axiosInstance.post(url,data, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data

  } catch (error) {
    console.log("Failed to create target")
    throw new Error('Failed to create target')
  }
})

//edit target
export const editTarget = createAsyncThunk('appTargets/editTargets', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/targets/${req.id}`

    const response = await axiosInstance.patch(url,req.data, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data

  } catch (error) {
    console.log("Failed to edit target")
    throw new Error('Failed to edit target')
  }
})

//delete
export const deleteTarget = createAsyncThunk('appTargets/deleteTarget', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/targets/${id}`

    const response = await axiosInstance.delete(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })
    // console.log("res:::", response)

    return response.data

  } catch (error) {
    console.log("Failed to delete target")
    throw new Error('Failed to delete target')
  }
})


export const appTargetsSlice = createSlice({
  name: 'appTargets',
  initialState: {
    targets:[],
    singleTargets:{}

  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getTargets.fulfilled, (state, action) => {
      state.targets = action.payload 
    })
    .addCase(getTargetById.fulfilled, (state, action) => {
      state.singleTargets = action.payload 
    })
    .addCase(createTarget.fulfilled, (state, action) => {
          state.success = true
        })
    .addCase(editTarget.fulfilled, (state, action) => {
          state.success = true
        })
    .addCase(deleteTarget.fulfilled, (state, action) => {
          state.success = true
        })
  }
})

export default appTargetsSlice.reducer
