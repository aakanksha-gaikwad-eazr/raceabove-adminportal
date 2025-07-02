import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

//** fetch all challenges

export const getChallenges = createAsyncThunk('appChallenges/getChallenges', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    // console.log("adminData", adminData)
    // console.log("token", accessToken)

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/challenges`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })
    // console.log("res:::", response)

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all challenges")
    throw new Error('Failed to fetch all challenges')
  }
})

export const getChallengesById = createAsyncThunk('appChallenges/getChallengesById', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    // console.log("adminData", adminData)
    // console.log("token", accessToken)

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }

    // console.log("id", id)

    let url = `${ip}/v1/challenges/${id}`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })
    // console.log("res::: by id", response.data.data)

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all challenges")
    throw new Error('Failed to fetch all challenges')
  }
})

//add challenge
export const createChallenges = createAsyncThunk('appChallenges/createChallenges', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/challenges`

    const response = await axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data

  } catch (error) {
    console.error("Failed to create challenge:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    })
    throw new Error(error.response?.data?.message || 'Failed to create challenge')
  }
})

//delete challenge
export const deleteChallenges = createAsyncThunk('appChallenges/deleteChallenges', async (id) => {
  console.log("delete id", id)
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    console.log("accessToken",accessToken)

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/challenges/${id}`


    const response = await axiosInstance.delete(url, {

      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    console.log("deleted user data", response)

    return response.data

  } catch (error) {
    console.log("Failed to create  challenge")
    throw new Error('Failed to create challenge')
  }
})

//update challenge
export const updateChallenges = createAsyncThunk(
  'appChallenges/updateChallenges',
  async (req, { rejectWithValue }) => {
    try {
      const adminData = JSON.parse(localStorage.getItem('raceabove'));
      const accessToken = adminData.accessToken; 

      if (!accessToken) {
        throw new Error('Access token not found in localStorage');
      }

      console.log("editid>>>", req?.id, req?.changedData)
      let url = `${ip}/v1/challenges/${req?.id}`; 

      const response = await axiosInstance.patch(url, req?.changedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      return response.data;
    } catch (error) {
      console.log('Failed to update challenges detail', error);
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);


export const appChallengesSlice = createSlice({
  name: 'appChallenges',
  initialState: {
    challenges:[],
    singleChallenge:[]
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getChallenges.fulfilled, (state, action) => {
      state.challenges = action.payload 
    })
    .addCase(getChallengesById.fulfilled, (state, action) => {
        state.singleChallenge = action.payload
    })
    .addCase(createChallenges.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteChallenges.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateChallenges.fulfilled, (state, action) => {
      state.success = true
    })
  }
})

export default appChallengesSlice.reducer
