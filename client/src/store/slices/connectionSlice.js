import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: 'connection',
    initialState: {
        activeItem: '',
        color: 'violet',
        isConnected: false,
        role: '',
        account: '',
        balance: 0,
        accountChanged: false,
        signedUp: false,
        loggedIn: false,
        username: '',
        loading: false
    },
    reducers: {
        setActiveItem(state, action) {
            state.activeItem = action.payload;
        },
        setColor(state, action) {
            state.color = action.payload;
        },
        setIsConnected(state, action) {
            state.isConnected = action.payload;
        },
        setRole(state, action) {
            state.role = action.payload;
        },
        setAccount(state, action) {
            state.account = action.payload;
        },
        setBalance(state, action) {
            state.balance = action.payload;
        },
        setAccountChanged(state, action) {
            state.accountChanged = action.payload;
        },
        setSignedUp(state, action) {
            state.signedUp = action.payload;
        },
        setLoggedIn(state, action) {
            state.loggedIn = action.payload;
        },
        setUsername(state, action) {
            state.username = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

export const {
    setActiveItem,
    setColor,
    setIsConnected,
    setRole,
    setAccount,
    setBalance,
    setAccountChanged,
    setSignedUp,
    setLoggedIn,
    setUsername,
    setLoading
} = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;