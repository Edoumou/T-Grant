import { createSlice } from "@reduxjs/toolkit";

const bondSlice = createSlice({
    name: 'bond',
    initialState: {
        bondSymbols: [],
        issuersName: []
    },
    reducers: {
        setBondSymbols(state, action) {
            state.bondSymbols = action.payload;
        },
        setIssuersName(state, action) {
            state.issuersName = action.payload;
        }
    }
});

export const {  setBondSymbols, setIssuersName } = bondSlice.actions;
export const bondReducer = bondSlice.reducer;