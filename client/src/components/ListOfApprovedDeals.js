import React from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Table, TableRow, TableHeader, TableHeaderCell, TableBody, TableCell, Button } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../../src/addresses/addr.json";
import "../users.css";
import "../manager.css";
import Formate from "../utils/Formate";
import { setSelectedDealCouponRate, setSelectedDealDenomination, setSelectedDealID, setSelectedDealIssuerName, setSelectedDealMaturityDate, setSelectedDealRemainingAmount, setSelectedDealTokenSymbol, setSelectedDealVolume, setShowInvestForm } from "../store";

function ListOfApprovedDeals() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const dispatch = useDispatch();

    const bonds = useSelector(state => {
        return state.bond;
    });

    const couponType = bonds.approvedDeals.map((deal, index) => {
        if(deal.couponType === '0') {
            return <span>Zero Coupon</span>
        } else if(deal.couponType === '1') {
            return <span>Fixed Rate</span>
        } else {
            return <span>Floating Rate</span>
        }
    });

    const renderedDeals = bonds.approvedDeals.map((deal, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">{deal.dealID}</TableCell>
                <TableCell textAlign="left">{bonds.issuersNameForApprovedDeals[index]}</TableCell>
                <TableCell textAlign="left"><a href={deal.prospectusURI} target="_blank" rel="noopener noreferrer"><strong>{deal.dealID.toLowerCase()}</strong></a></TableCell>
                <TableCell textAlign="center">{bonds.issuersForApprovedDeals[index].creditRating}</TableCell>
                <TableCell textAlign="center">{Formate(bonds.issuersForApprovedDeals[index].carbonCredit)}</TableCell>
                <TableCell positive textAlign="right">{Formate(deal.debtAmount)} {bonds.tokenSymbolForApprovedDeals[index]}</TableCell>
                <TableCell positive textAlign="right">{Formate(deal.denomination)} {bonds.tokenSymbolForApprovedDeals[index]}</TableCell>
                <TableCell warning textAlign="center">{deal.couponRate / 100}%</TableCell>
                <TableCell textAlign="center">{deal.couponFrequency}</TableCell>
                <TableCell warning textAlign="center">{couponType[index]}</TableCell>
                <TableCell positive textAlign="right">{(new Date(deal.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                <TableCell textAlign="center">
                    <Button
                        key={index}
                        compact
                        color='linkedin'
                        onClick={
                            () => setDeal(
                                    deal.dealID,
                                    deal.debtAmount,
                                    deal.denomination,
                                    bonds.tokenSymbolForApprovedDeals[index],
                                    bonds.issuersNameForApprovedDeals[index],
                                    deal.couponRate,
                                    deal.maturityDate
                                )
                        }
                    >
                        Invest
                    </Button>
                </TableCell>
            </TableRow>
        );
    });

    const setDeal = async (dealID, dealVolume, dealDenomination, tokenSymbol, issuersName, couponRate, maturityDate)=> {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);

        let totalAmountInvested = await bankContract.methods.totalAmountInvestedForDeal(dealID).call({ from: account });
        let remainingAmount =  dealVolume - totalAmountInvested;

        dispatch(setSelectedDealID(dealID));
        dispatch(setSelectedDealDenomination(dealDenomination));
        dispatch(setSelectedDealVolume(dealVolume));
        dispatch(setSelectedDealTokenSymbol(tokenSymbol));
        dispatch(setSelectedDealIssuerName(issuersName));
        dispatch(setSelectedDealCouponRate(couponRate));
        dispatch(setSelectedDealMaturityDate(maturityDate));
        dispatch(setSelectedDealRemainingAmount(remainingAmount));
        dispatch(setShowInvestForm(true));
    }

    return (
        <>
            <div className="managerDealList">
                <strong>List of Approved Deals</strong>
            </div>
            {
                bonds.approvedDeals.length > 0 ?
                    <div className="tab-scroll">
                        <Table padded selectable>
                            <TableHeader className="header-sticky">
                                <TableRow>
                                    <TableHeaderCell textAlign="left">Deal ID</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Issuer</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Prospectus</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Credit rading</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Carbon Credit</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Denomination</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Coupon</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Frequency</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Type</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Maturity</TableHeaderCell>
                                    <TableHeaderCell></TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedDeals}
                            </TableBody>
                        </Table>
                    </div>
                :
                    <div  className="no-approved-deal">
                        No approved deal has been found.
                        <br></br>
                        <br></br>
                        Come back later
                    </div>
            }
        </>
    );
}

export default ListOfApprovedDeals;