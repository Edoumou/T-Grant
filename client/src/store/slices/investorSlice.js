import { createSlice } from "@reduxjs/toolkit";

const investorSlice = createSlice({
    name: 'investor',
    initialState: {
        registrationStatus: 0,
        listOfInvestors: []
    },
    reducers: {
        setInvestorRegistrationStatus(state, action) {
            state.registrationStatus = action.payload;
        },
        setListOfInvestors(state, action) {
            state.listOfInvestors = action.payload;
        }
    }
});

export const {  setInvestorRegistrationStatus, setListOfInvestors } = investorSlice.actions;
export const investorReducer = investorSlice.reducer;