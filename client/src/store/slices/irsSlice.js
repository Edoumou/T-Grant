import { createSlice } from "@reduxjs/toolkit";

const irsSlice = createSlice({
    name: 'irs',
    initialState: {
        listOfIRS: [],
        issuerIRS: []
    },
    reducers: {
        setListOfIRS(state, action) {
            state.listOfIRS = action.payload;
        },
        setIssuerIRS(state, action) {
            state.issuerIRS = action.payload;
        }
    }
});

export const { setListOfIRS, setIssuerIRS } = irsSlice.actions;
export const irsReducer = irsSlice.reducer;