import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInstance from "@/utils/axiosInstance";
import { ip } from '../../../config/config'

// Get all event categories
export const getEventCategory = createAsyncThunk(
  "appEventCategorySlice/getEventCategory",
  async (_, { rejectWithValue }) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }
      
      let url = `${ip}/v2/event-categories`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch event categories:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch event categories" }
      );
    }
  }
);

// Get single event category by ID
export const getEventCategoryById = createAsyncThunk(
  "appEventCategorySlice/getEventCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/event-categories/${id}`;

      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch event category:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch event category" }
      );
    }
  }
);

// Create new event category
export const createEventCategory = createAsyncThunk(
  "appEventCategorySlice/createEventCategory",
  async (data, { rejectWithValue }) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      let url = `${ip}/v2/event-categories`;

      const response = await axiosInstance.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Created event category:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to create event category:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to create event category" }
      );
    }
  }
);

// Update event category
export const updateEventCategory = createAsyncThunk(
  "appEventCategorySlice/updateEventCategory",
  async (req, { rejectWithValue }) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      const url = `${ip}/v2/event-categories/${req?.id}`;

      const response = await axiosInstance.patch(url, req?.data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Updated event category:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to update event category:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to update event category" }
      );
    }
  }
);

// Delete event category
export const deleteEventCategory = createAsyncThunk(
  "appEventCategorySlice/deleteEventCategory",
  async (id, { rejectWithValue }) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("raceabove"));
      const accessToken = adminData.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in localStorage");
      }

      const url = `${ip}/v2/event-categories/${id}`;

      const response = await axiosInstance.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Deleted event category:", response.data);
      return { id, ...response.data };
    } catch (error) {
      console.error("Failed to delete event category:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete event category" }
      );
    }
  }
);

export const appEventCategorySlice = createSlice({
  name: 'appEventCategory',
  initialState: {
    eventCategory: [],
    singleEventCategory: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetSingleEventCategory: (state) => {
      state.singleEventCategory = null;
    }
  },
  extraReducers: builder => {
    builder
      // Get all event categories
      .addCase(getEventCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventCategory = action.payload;
        state.error = null;
      })
      .addCase(getEventCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get single event category
      .addCase(getEventCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleEventCategory = action.payload;
        state.error = null;
      })
      .addCase(getEventCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create event category
      .addCase(createEventCategory.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEventCategory.fulfilled, (state, action) => {
        state.isCreating = false;
        state.success = true;
        state.error = null;
        // Add new category to the list
        if (action.payload.data) {
          state.eventCategory.push(action.payload.data);
        }
      })
      .addCase(createEventCategory.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update event category
      .addCase(updateEventCategory.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEventCategory.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.success = true;
        state.error = null;
        // Update the category in the list
        if (action.payload.data) {
          const index = state.eventCategory.findIndex(
            category => category.id === action.payload.data.id
          );
          if (index !== -1) {
            state.eventCategory[index] = action.payload.data;
          }
          // Update single category if it's the same one
          if (state.singleEventCategory && state.singleEventCategory.id === action.payload.data.id) {
            state.singleEventCategory = action.payload.data;
          }
        }
      })
      .addCase(updateEventCategory.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete event category
      .addCase(deleteEventCategory.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteEventCategory.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.success = true;
        state.error = null;
        // Remove the category from the list
        state.eventCategories = state.eventCategories.filter(
          category => category.id !== action.payload.id
        );
        // Clear single category if it's the deleted one
        if (state.singleEventCategory && state.singleEventCategory.id === action.payload.id) {
          state.singleEventCategory = null;
        }
      })
      .addCase(deleteEventCategory.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
        state.success = false;
      });
  }
})

// Export actions
export const { clearError, clearSuccess, resetSingleEventCategory } = appEventCategorySlice.actions;

export default appEventCategorySlice.reducer;