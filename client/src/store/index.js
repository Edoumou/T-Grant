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
    setBalance,
    setAccountChanged,
    setSignedUp,
    setLoggedIn,
    setUsername,
    setLoading
} from "./slices/connectionSlice";
import { issuerReducer, setIssuerRequest, setListOfIssuers, setShowForm } from "./slices/issuerSlice";
import { investorReducer, setInvestorRequest, setListOfInvestors } from "./slices/investorSlice";


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
    setBalance,
    setAccountChanged,
    setSignedUp,
    setLoggedIn,
    setUsername,
    setLoading,
    setIssuerRequest,
    setShowForm,
    setInvestorRequest,
    setListOfIssuers,
    setListOfInvestors
}