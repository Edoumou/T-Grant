import { createSlice } from "@reduxjs/toolkit";

const issuerSlice = createSlice({
    name: 'issuer',
    initialState: {
        issuerRequest: {},
        listOfIssuers: [],
        showForm: false
    },
    reducers: {
        setIssuerRequest(state, action) {
            state.issuerRequest = action.payload;
        },
        setListOfIssuers(state, action) {
            state.listOfIssuers = action.payload;
        },
        setShowForm(state, action) {
            state.showForm = action.payload;
        }
    }
});

export const {  setIssuerRequest, setListOfIssuers, setShowForm } = issuerSlice.actions;
export const issuerReducer = issuerSlice.reducer;