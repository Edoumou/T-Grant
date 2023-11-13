import { createSlice } from "@reduxjs/toolkit";

const issuerSlice = createSlice({
    name: 'issuer',
    initialState: {
        registrationStatus: 0
    },
    reducers: {
        setIssuerRegistrationStatus(state, action) {
            state.registrationStatus = action.payload;
        },
    }
});

export const {  setIssuerRegistrationStatus } = issuerSlice.actions;
export const issuerReducer = issuerSlice.reducer;