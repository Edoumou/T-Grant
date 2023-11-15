import { createSlice } from "@reduxjs/toolkit";

const issuerSlice = createSlice({
    name: 'issuer',
    initialState: {
        registrationStatus: 0,
        listOfIssuers: []
    },
    reducers: {
        setIssuerRegistrationStatus(state, action) {
            state.registrationStatus = action.payload;
        },
        setListOfIssuers(state, action) {
            state.listOfIssuers = action.payload;
        }
    }
});

export const {  setIssuerRegistrationStatus, setListOfIssuers } = issuerSlice.actions;
export const issuerReducer = issuerSlice.reducer;