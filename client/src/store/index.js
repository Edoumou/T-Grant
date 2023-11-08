import { configureStore } from "@reduxjs/toolkit";
import { registryReducer, setIsVerified, setRegistrationStatus, setRegistrarOwner } from "./slices/registrySlice";


/**
* Configure store
*/
const store = configureStore({
    reducer: {
        registry:  registryReducer
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
    setRegistrarOwner 
}