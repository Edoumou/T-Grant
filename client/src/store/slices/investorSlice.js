import { createSlice } from "@reduxjs/toolkit";

const investorSlice = createSlice({
    name: 'investor',
    initialState: {
        investorRequest: {},
        listOfInvestors: [],
        investorBonds: [],
        investorBondsIssuers: [],
        investorsBondsCurrencies: []
    },
    reducers: {
        setInvestorRequest(state, action) {
            state.investorRequest = action.payload;
        },
        setListOfInvestors(state, action) {
            state.listOfInvestors = action.payload;
        },
        setInvestorBonds(state, action) {
            state.investorBonds = action.payload;
        },
        setInvestorBondsIssuers(state, action) {
            state.investorBondsIssuers = action.payload;
        }
    }
});

export const {
    setInvestorRequest,
    setListOfInvestors,
    setInvestorBonds,
    setInvestorBondsIssuers
} = investorSlice.actions;
export const investorReducer = investorSlice.reducer;