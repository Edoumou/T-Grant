import { createSlice } from "@reduxjs/toolkit";

const irsSlice = createSlice({
    name: 'irs',
    initialState: {
        benchmark: 0,
        listOfIRS: [],
        issuerIRS: []
    },
    reducers: {
        setBenchmark(state, action) {
            state.benchmark = action.payload;
        },
        setListOfIRS(state, action) {
            state.listOfIRS = action.payload;
        },
        setIssuerIRS(state, action) {
            state.issuerIRS = action.payload;
        }
    }
});

export const { setBenchmark, setListOfIRS, setIssuerIRS } = irsSlice.actions;
export const irsReducer = irsSlice.reducer;