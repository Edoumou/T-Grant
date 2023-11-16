import { createSlice } from "@reduxjs/toolkit";

const investorSlice = createSlice({
    name: 'investor',
    initialState: {
        investorRequest: {},
        listOfInvestors: []
    },
    reducers: {
        setInvestorRequest(state, action) {
            state.investorRequest = action.payload;
        },
        setListOfInvestors(state, action) {
            state.listOfInvestors = action.payload;
        }
    }
});

export const {  setInvestorRequest, setListOfInvestors } = investorSlice.actions;
export const investorReducer = investorSlice.reducer;