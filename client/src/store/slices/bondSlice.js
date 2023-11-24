import { createSlice } from "@reduxjs/toolkit";

const bondSlice = createSlice({
    name: 'bond',
    initialState: {
        selectedDealID: '',
        selectedDealVolume: '',
        selectedDealDenomination: '',
        selectedDealTokenSymbol: '',
        selectedDealIssuerName: '',
        selectedDealCouponRate: '',
        selectedDealMaturityDate: '',
        selectedDealRemainingAmount: '',
        showInvestForm: false,
        bondSymbols: [],
        issuersName: [],
        issuersNameForApprovedDeals: [],
        approvedDeals: [],
        issuersForApprovedDeals: [],
        tokenSymbolForApprovedDeals: [],
        dealsToIssue: [],
        dealToIssue: [],
        issuerNameForDealToIssue: '',
        countryForDealToIssue: '',
        showIssueDealForm: false
    },
    reducers: {
        setSelectedDealID(state, action) {
            state.selectedDealID = action.payload;
        },
        setSelectedDealVolume(state, action) {
            state.selectedDealVolume = action.payload;
        },
        setSelectedDealDenomination(state, action) {
            state.selectedDealDenomination = action.payload;
        },
        setSelectedDealTokenSymbol(state, action) {
            state.selectedDealTokenSymbol = action.payload;
        },
        setSelectedDealIssuerName(state, action) {
            state.selectedDealIssuerName = action.payload;
        },
        setSelectedDealCouponRate(state, action) {
            state.selectedDealCouponRate = action.payload;
        },
        setSelectedDealMaturityDate(state, action) {
            state.selectedDealMaturityDate = action.payload;
        },
        setSelectedDealRemainingAmount(state, action) {
            state.selectedDealRemainingAmount = action.payload;
        },
        setShowInvestForm(state, action) {
            state.showInvestForm = action.payload;
        },
        setBondSymbols(state, action) {
            state.bondSymbols = action.payload;
        },
        setIssuersName(state, action) {
            state.issuersName = action.payload;
        },
        setIssuersNameForApprovedDeals(state, action) {
            state.issuersNameForApprovedDeals = action.payload;
        },
        setApprovedDeals(state, action) {
            state.approvedDeals = action.payload;
        },
        setIssuersForApprovedDelas(state, action) {
            state.issuersForApprovedDeals = action.payload;
        },
        setTokenSymbolForApprovedDeals(state, action) {
            state.tokenSymbolForApprovedDeals = action.payload;
        },
        setDealsToIssue(state, action) {
            state.dealsToIssue = action.payload;
        },
        setDealToIssue(state, action) {
            state.dealToIssue = action.payload;
        },
        setIssuerNameForDealToIssue(state, action) {
            state.issuerNameForDealToIssue = action.payload;
        },
        setCountryForDealToIssue(state, action) {
            state.countryForDealToIssue = action.payload;
        },
        setShowIssueDealForm(state, action) {
            state.showIssueDealForm = action.payload;
        }
    }
});

export const {
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
    setIssuersNameForApprovedDeals,
    setApprovedDeals,
    setIssuersForApprovedDelas,
    setTokenSymbolForApprovedDeals,
    setDealsToIssue,
    setDealToIssue,
    setIssuerNameForDealToIssue,
    setCountryForDealToIssue,
    setShowIssueDealForm
} = bondSlice.actions;
export const bondReducer = bondSlice.reducer;