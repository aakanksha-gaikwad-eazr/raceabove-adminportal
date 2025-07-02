import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { ip } from "../../../config/config";

//** fetch a single admin

export const getSingleAdmin = createAsyncThunk(
  "appAdmins/getSingleAdmin",
  async (id) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v1/admins/${id}`;

      const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Accept": "application/json",
          },
      });
    
      // console.log("get res admin", response);

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch admin data");
      throw new Error("Failed to fetch admin data");
    }
  }
);

export const getAllAdmin = createAsyncThunk("appAdmins/getallAdmin",async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      let url = `${ip}/v1/admins`;

      const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Accept": "application/json",
          },
      });
    
      // console.log("get all admin", response);

      return response.data.data;
    } catch (error) {
      console.log("Failed to fetch all admin data");
      throw new Error("Failed to fetch all admin data");
    }
  }
);

//create admins
export const createAdmin = createAsyncThunk("appAdmins/createAdmin", async (formData) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v1/admins`;
      console.log("req body formData", formData)

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("response from admin", response)
      return response.data;
    } catch (error) {
      console.error("Failed to create admin:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to create admin');
    }
  }
);

//update admins
export const updateAdmin = createAsyncThunk(
  "appAdmins/updateAdmin",
  async (req) => {
    try {
      console.log(req, "req data of admin");
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v1/admins/${req?.editId}`;

      const response = await axios.patch(url, req?.changedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("res admin data", response.data);

      return response.data;
    } catch (error) {
      console.log("Failed to update admin detail", error);
    }
  }
);

//delete admin
export const deleteAdmin = createAsyncThunk("appAdmins/deleteAdmin",async (id) => {
    try {
     
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v1/admins/${id}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Failed to delete admin", error);
    }
  }
);

export const appAdminsSlice = createSlice({
  name: "appAdmins",
  initialState: {
    singleadmin: {},
    admins: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.success = true;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.success = true;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.success = true;
      })
      .addCase(getSingleAdmin.fulfilled, (state, action) => {
        state.singleadmin = action.payload;
      })
      .addCase(getAllAdmin.fulfilled, (state, action) => {
        state.admins = action.payload;
      })
  },
});

export default appAdminsSlice.reducer;
 