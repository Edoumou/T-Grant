import { createSlice } from "@reduxjs/toolkit";

const bondSlice = createSlice({
    name: 'bond',
    initialState: {
        bondSymbols: [],
        issuersName: [],
        issuersNameForApprovedDeals: [],
        approvedDeals: [],
        issuersForApprovedDeals: []
    },
    reducers: {
        setBondSymbols(state, action) {
            state.bondSymbols = action.payload;
        },
        setIssuersName(state, action) {
            state.issuersName = action.payload;
        },
        setIssuersNameForApprovedDeals(state, action) {
            state.issuersNameForApprovedDeals = action.payload;
        },
        setApprovedDeals(state, action) {
            state.approvedDeals = action.payload;
        },
        setIssuersForApprovedDelas(state, action) {
            state.issuersForApprovedDeals = action.payload;
        }
    }
});

export const { 
    setBondSymbols,
    setIssuersName,
    setIssuersNameForApprovedDeals,
    setApprovedDeals,
    setIssuersForApprovedDelas
} = bondSlice.actions;
export const bondReducer = bondSlice.reducer;