import { createSlice } from "@reduxjs/toolkit";

const registrySlice = createSlice({
    name: 'registry',
    initialState: {
        isVerified: false,
    },
    reducers: {
        setIsVerified(state, action) {
            state.isVerified = action.payload;
        }
    }
});

export const {  setIsVerified } = registrySlice.actions;
export const registryReducer = registrySlice.reducer;