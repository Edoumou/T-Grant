import { configureStore } from "@reduxjs/toolkit";
import {
    registryReducer,
    setIsVerified,
    setRegistrationStatus,
    setRegistrarOwner
} from "./slices/registrySlice";
import { bondReducer, setBondSymbols, setIssuersName, setApprovedDeals } from "./slices/bondSlice";
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
    setLoading,
    setTokenSymbols,
    setTokenAddresses,
    setDeals
} from "./slices/connectionSlice";
import { issuerReducer, setIssuerRequest, setListOfIssuers, setShowForm, setIssuerDealsCurrencySymbols } from "./slices/issuerSlice";
import { investorReducer, setInvestorRequest, setListOfInvestors } from "./slices/investorSlice";


/**
* Configure store
*/
const store = configureStore({
    reducer: {
        registry:  registryReducer,
        connection: connectionReducer,
        issuer: issuerReducer,
        investor: investorReducer,
        bond: bondReducer
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export {
    store,
    setBondSymbols,
    setIssuersName,
    setApprovedDeals,
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
    setTokenSymbols,
    setTokenAddresses,
    setDeals,
    setIssuerRequest,
    setShowForm,
    setIssuerDealsCurrencySymbols,
    setInvestorRequest,
    setListOfIssuers,
    setListOfInvestors
}