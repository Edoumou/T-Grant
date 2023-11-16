import { createSlice } from "@reduxjs/toolkit";

const issuerSlice = createSlice({
    name: 'issuer',
    initialState: {
        issuerRequest: {},
        listOfIssuers: []
    },
    reducers: {
        setIssuerRequest(state, action) {
            state.issuerRequest = action.payload;
        },
        setListOfIssuers(state, action) {
            state.listOfIssuers = action.payload;
        }
    }
});

export const {  setIssuerRequest, setListOfIssuers } = issuerSlice.actions;
export const issuerReducer = issuerSlice.reducer;