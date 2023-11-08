import { createSlice } from "@reduxjs/toolkit";

const registrySlice = createSlice({
    name: 'registry',
    initialState: {
        isVerified: false,
        registrationtatus: 0,
        registrarOwner: ''
    },
    reducers: {
        setIsVerified(state, action) {
            state.isVerified = action.payload;
        },
        setRegistrationStatus(state, action) {
            state.registrationtatus = action.payload;
        },
        setRegistrarOwner(state, action) {
            state.registrarOwner = action.payload;
        }
    }
});

export const {  setIsVerified, setRegistrationStatus, setRegistrarOwner } = registrySlice.actions;
export const registryReducer = registrySlice.reducer;