import React from "react";
import { useSelector } from "react-redux";
import "../users.css";
import "../manager.css";
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import Formate from "../utils/Formate";

function IssueDealForm() {
    const bonds = useSelector(state => {
        return state.bond;
    });

    return (
        <>
            <div>
                <Table padded>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell textAlign="left">Deal ID</TableHeaderCell>
                            <TableHeaderCell textAlign="left">Issuer</TableHeaderCell>
                            <TableHeaderCell textAlign="left">Country</TableHeaderCell>
                            <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                            <TableHeaderCell textAlign="center">Coupon Rate</TableHeaderCell>
                            <TableHeaderCell textAlign="right">Maturity Date</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{bonds.dealToIssue.dealID}</TableCell>
                            <TableCell warning>{bonds.issuerNameForDealToIssue}</TableCell>
                            <TableCell>{bonds.countryForDealToIssue}</TableCell>
                            <TableCell positive textAlign="right">{Formate(bonds.dealToIssue.debtAmount)} {bonds.currencyForDealToIssue}</TableCell>
                            <TableCell warning textAlign="center">{bonds.dealToIssue.couponRate / 100}%</TableCell>
                            <TableCell textAlign="right">{(new Date(bonds.dealToIssue.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

export default IssueDealForm;