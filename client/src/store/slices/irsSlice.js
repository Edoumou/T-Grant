import { createSlice } from "@reduxjs/toolkit";

const irsSlice = createSlice({
    name: 'irs',
    initialState: {
        listOfIRS: []
    },
    reducers: {
        setListOfIRS(state, action) {
            state.listOfIRS = action.payload;
        }
    }
});

export const { setListOfIRS } = irsSlice.actions;
export const irsReducer = irsSlice.reducer;