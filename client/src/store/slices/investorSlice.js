import { createSlice } from "@reduxjs/toolkit";

const investorSlice = createSlice({
    name: 'investor',
    initialState: {
        registrationStatus: 0
    },
    reducers: {
        setInvestorRegistrationStatus(state, action) {
            state.registrationStatus = action.payload;
        },
    }
});

export const {  setInvestorRegistrationStatus } = investorSlice.actions;
export const investorReducer = investorSlice.reducer;