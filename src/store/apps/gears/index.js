import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'


export const getGears = createAsyncThunk('appGears/getGears', async () => { 
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/gears`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch all gears")
    throw new Error('Failed to fetch all the gears')
  }
})


export const getGearsById = createAsyncThunk('appGears/getGearsById', async (id) => { 
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) { 
      throw new Error('Access token not found in localStorage')
    }
    let url = `${ip}/v1/gears/${id}`

    const response = await axiosInstance.get(url, {
      headers:  { Authorization: `Bearer ${accessToken}`}
    })

    return response.data.data

  } catch (error) {
    console.log("Failed to fetch a gears")
    throw new Error('Failed to fetch a the gears')
  }
})

//add user
export const createGears = createAsyncThunk('appGears/createGears', async (formData) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'));
    const accessToken = adminData?.accessToken;

    if (!accessToken) {
      throw new Error('Access token not found in localStorage');
    }

    const url = `${ip}/v1/gears`;

    // Debug log formData content
    // if (formData?.forEach) {
    //   formData.forEach((value, key) => {
    //     console.log(`🧾 ${key}:`, value);
    //   });
    // }

    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to create gear');
  }
});



export const deleteGears = createAsyncThunk('appGears/deleteGears', async id => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    // console.log("accessToken",accessToken)

    const url = `${ip}/v1/gears/${id}`

    const response = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    return response.data
  } catch (error) {
    console.log("Couldn't delete", error)
    throw error;
  }
})

//update the user
export const updateGears = createAsyncThunk('appGears/updateGears', async (req) => {
  try {
    const adminData = JSON.parse(localStorage.getItem('raceabove'))
    const accessToken = adminData.accessToken

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }
  
    let url = `${ip}/v1/gears/${req.id}`

    const response = await axiosInstance.patch(url,req?.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      } 
    })
    
    return response?.data

  } catch (error) {
    console.error("❌ API Request Failed:", error.response?.data || error.message);
    throw new Error('Failed to update user details')
  }
})



export const appGearsSlice = createSlice({
  name: 'appGears',
  initialState: {
    gears:[],
    singleGear: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(getGears.fulfilled, (state, action) => {
      state.gears = action.payload 
    })
    .addCase(getGearsById.fulfilled, (state, action) => {
      state.singleGear = action.payload 
    })
    .addCase(createGears.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(deleteGears.fulfilled, (state, action) => {
      state.success = true
    })
    .addCase(updateGears.fulfilled, (state, action) => {
      state.success = true
    })
  }
})

export default appGearsSlice.reducer
