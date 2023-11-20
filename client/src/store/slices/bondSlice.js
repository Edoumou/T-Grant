import { createSlice } from "@reduxjs/toolkit";

const bondSlice = createSlice({
    name: 'bond',
    initialState: {
        bondSymbols: []
    },
    reducers: {
        setBondSymbols(state, action) {
            state.bondSymbols = action.payload;
        }
    }
});

export const {  setBondSymbols } = bondSlice.actions;
export const bondReducer = bondSlice.reducer;