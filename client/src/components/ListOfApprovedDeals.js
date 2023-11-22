import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Table, TableRow, TableHeader, TableHeaderCell, TableBody, TableCell } from "semantic-ui-react";
import "../users.css";
import "../manager.css";
import Formate from "../utils/Formate";

function ListOfApprovedDeals() {
    const connection = useSelector(state => {
        return state.connection;
    });

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
                <TableCell textAlign="left"><a href={deal.prospectusURI} target="_blank"><strong>{deal.dealID.toLowerCase()}</strong></a></TableCell>
                <TableCell textAlign="left">{bonds.issuersForApprovedDeals[index].creditRating}</TableCell>
                <TableCell textAlign="left">{Formate(bonds.issuersForApprovedDeals[index].carbonCredit)}</TableCell>
                <TableCell positive textAlign="right">{Formate(deal.debtAmount)} {bonds.bondSymbols[index]}</TableCell>
                <TableCell warning textAlign="center">{deal.couponRate / 100}%</TableCell>
                <TableCell textAlign="center">{deal.couponFrequency}</TableCell>
                <TableCell warning textAlign="center">{couponType[index]}</TableCell>
                <TableCell positive textAlign="right">{(new Date(deal.maturityDate * 1000)).toLocaleDateString()}</TableCell>
            </TableRow>
        );
    });

    return (
        <>
            <div className="managerDealList">
                <strong>List of Approved Deals</strong>
            </div>
            {
                connection.deals.length > 0 ?
                    <div className="tab-scroll">
                        <Table padded>
                            <TableHeader className="header-sticky">
                                <TableRow>
                                    <TableHeaderCell textAlign="left">Deal ID</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Issuer</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Prospectus</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Credit rading</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Carbon Credit</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Coupon</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Frequency</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Type</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Maturity</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedDeals}
                            </TableBody>
                        </Table>
                    </div>
                :
                    <div  className="list-card-head-no">
                        There is No Deal
                    </div>
            }
        </>
    );
}

export default ListOfApprovedDeals;