import { createSlice } from "@reduxjs/toolkit";

const bondSlice = createSlice({
    name: 'bond',
    initialState: {
        selectedDealID: '',
        showInvestForm: false,
        bondSymbols: [],
        issuersName: [],
        issuersNameForApprovedDeals: [],
        approvedDeals: [],
        issuersForApprovedDeals: [],
        tokenSymbolForApprovedDeals: []
    },
    reducers: {
        setSelectedDealID(state, action) {
            state.selectedDealID = action.payload;
        },
        setShowInvestForm(state, action) {
            state.showInvestForm = action.payload;
        },
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
        },
        setTokenSymbolForApprovedDeals(state, action) {
            state.tokenSymbolForApprovedDeals = action.payload;
        }
    }
});

export const {
    setSelectedDealID, 
    setShowInvestForm,
    setBondSymbols,
    setIssuersName,
    setIssuersNameForApprovedDeals,
    setApprovedDeals,
    setIssuersForApprovedDelas,
    setTokenSymbolForApprovedDeals
} = bondSlice.actions;
export const bondReducer = bondSlice.reducer;