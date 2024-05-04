import { configureStore } from "@reduxjs/toolkit";
import {
    registryReducer,
    setIsVerified,
    setRegistrationStatus,
    setRegistrarOwner
} from "./slices/registrySlice";
import {
    bondReducer,
    setSelectedDealID,
    setSelectedDealVolume,
    setSelectedDealDenomination,
    setSelectedDealTokenSymbol,
    setSelectedDealIssuerName,
    setSelectedDealCouponRate,
    setSelectedDealMaturityDate,
    setSelectedDealRemainingAmount,
    setShowInvestForm,
    setBondSymbols,
    setIssuersName,
    setIssuersLogo,
    setIssuersNameForApprovedDeals,
    setApprovedDeals,
    setDealsFund,
    setIssuersForApprovedDelas,
    setTokenSymbolForApprovedDeals,
    setDealsToIssue,
    setDealToIssue,
    setIssuerNameForDealToIssue,
    setCountryForDealToIssue,
    setCurrencyForDealToIssue,
    setShowIssueDealForm,
    setBonds,
    setActiveBondsDealID,
    setSelectedActiveBond,
    setInvestorsForSelectedActiveDeal,
    setBondsDealIDs,
    setBondsIssuers,
    setBondsCurrency,
    setDealsListed,
    setCouponsPaid
} from "./slices/bondSlice";
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
import {
    issuerReducer,
    setIssuerRequest,
    setListOfIssuers,
    setShowForm,
    setIssuerDealsCurrencySymbols
} from "./slices/issuerSlice";
import {
    investorReducer,
    setInvestorRequest,
    setListOfInvestors,
    setInvestorBonds,
    setInvestorBondsIssuers
} from "./slices/investorSlice";

import { irsReducer, setBenchmark, setListOfIRS, setIssuerIRS } from "./slices/irsSlice";


/**
* Configure store
*/
const store = configureStore({
    reducer: {
        registry: registryReducer,
        connection: connectionReducer,
        issuer: issuerReducer,
        investor: investorReducer,
        bond: bondReducer,
        irs: irsReducer
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export {
    store,
    setSelectedDealID,
    setSelectedDealVolume,
    setSelectedDealDenomination,
    setSelectedDealTokenSymbol,
    setSelectedDealIssuerName,
    setSelectedDealCouponRate,
    setSelectedDealMaturityDate,
    setSelectedDealRemainingAmount,
    setShowInvestForm,
    setBondSymbols,
    setIssuersName,
    setIssuersLogo,
    setIssuersNameForApprovedDeals,
    setApprovedDeals,
    setDealsFund,
    setIssuersForApprovedDelas,
    setTokenSymbolForApprovedDeals,
    setDealsToIssue,
    setDealToIssue,
    setIssuerNameForDealToIssue,
    setCountryForDealToIssue,
    setCurrencyForDealToIssue,
    setShowIssueDealForm,
    setBonds,
    setActiveBondsDealID,
    setSelectedActiveBond,
    setInvestorsForSelectedActiveDeal,
    setBondsDealIDs,
    setBondsIssuers,
    setBondsCurrency,
    setDealsListed,
    setCouponsPaid,
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
    setListOfInvestors,
    setInvestorBonds,
    setInvestorBondsIssuers,
    setBenchmark,
    setListOfIRS,
    setIssuerIRS
}