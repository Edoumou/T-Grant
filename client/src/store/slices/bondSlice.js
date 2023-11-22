import { createSlice } from "@reduxjs/toolkit";

const bondSlice = createSlice({
    name: 'bond',
    initialState: {
        bondSymbols: [],
        issuersName: [],
        approvedDeals: []
    },
    reducers: {
        setBondSymbols(state, action) {
            state.bondSymbols = action.payload;
        },
        setIssuersName(state, action) {
            state.issuersName = action.payload;
        },
        setApprovedDeals(state, action) {
            state.approvedDeals = action.payload;
        }
    }
});

export const {  setBondSymbols, setIssuersName, setApprovedDeals } = bondSlice.actions;
export const bondReducer = bondSlice.reducer;