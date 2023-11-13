import { configureStore } from "@reduxjs/toolkit";
import {
    registryReducer,
    setIsVerified,
    setRegistrationStatus,
    setRegistrarOwner
} from "./slices/registrySlice";
import { 
    connectionReducer,
    setActiveItem,
    setColor,
    setIsConnected,
    setRole,
    setAccount,
    setAccountChanged,
    setSignedUp,
    setLoggedIn,
    setUsername,
    setLoading
} from "./slices/connectionSlice";
import { issuerReducer, setIssuerRegistrationStatus } from "./slices/issuerSlice";
import { investorReducer, setInvestorRegistrationStatus } from "./slices/investorSlice";


/**
* Configure store
*/
const store = configureStore({
    reducer: {
        registry:  registryReducer,
        connection: connectionReducer,
        issuer: issuerReducer,
        investor: investorReducer
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export {
    store,
    setIsVerified,
    setRegistrationStatus,
    setRegistrarOwner,
    setActiveItem,
    setColor,
    setIsConnected,
    setRole,
    setAccount,
    setAccountChanged,
    setSignedUp,
    setLoggedIn,
    setUsername,
    setLoading,
    setIssuerRegistrationStatus,
    setInvestorRegistrationStatus
}