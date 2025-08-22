import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'
// import { ip } from 'config/config'

//** fetch all users

export const getUsers = createAsyncThunk('appUsers/getUsers', async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    // console.log("adminData", adminData)
    // console.log("token", accessToken)

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v2/users`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })
    // console.log("res:::", response)

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all users")
    throw new Error('Failed to fetch all the users')
  }
})

//add user
export const createUser = createAsyncThunk('appUsers/createUser', async (data) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

  
    let url = `${ip}/v2/users`

    const response = await axiosInstance.post(url,data, {
   
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    // console.log("created user data", response)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to Create user details')
  }
})

export const deleteUser = createAsyncThunk('appUsers/deleteUser', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    // console.log("accessToken",accessToken)

    const url = `${ip}/v2/users/${id}`

    const response = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    console.log('deleted the user', response.data)

    return response.data
  } catch (error) {
    console.log("Couldn't delete", error)
    throw error;
  }
})

//update the user
export const updateUser = createAsyncThunk('appUsers/updateUser', async (req) => {
  console.log("data:::", req)
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    // console.log("accessToken",accessToken)

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v2/users/${req.id}/admin`
    console.log(req,"req")

    const response = await axiosInstance.patch(url,req?.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
        'Content-Type': 'multipart/form-data',
      } 
    })
    
    console.log("update user data", response.data)

    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update user details')
  }
})

//get single user's all the data 
export const getAllDataOfUser = createAsyncThunk('appUsers/allDataOfUser', async (id) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    console.log("accessToken",accessToken)

    if (!accessToken) {
      console.log("'Access token not found in localStorage'")
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v2/users/${id}`

    const response = await axiosInstance.get(url,id, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    console.log("user details data", response.data)

    return response?.data?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update user details')
  }
})



export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    users:[],
    allDataOfSingleUser:{}
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload 
    })
    .addCase(createUser.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(getAllDataOfUser.fulfilled, (state, action) => {
      state.allDataOfSingleUser= action.payload
    })
  }
})

export default appUsersSlice.reducer
