import React from "react";
import { useSelector } from "react-redux";
import "../users.css";
import "../manager.css";
import Formate from "../utils/Formate";
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";

function BondsCouponsPaid() {
    let bonds = useSelector(state => {
        return state.bond;
    });

    const renderedReceipt = bonds.couponsPaid.map((receipt, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="right">{Formate(receipt.issueVolume)} {bonds.selectedActiveBond.tokenSymbol}</TableCell>
                <TableCell warning textAlign="center">{receipt.couponRate / 100}%</TableCell>
                <TableCell positive textAlign="right">{Formate(receipt.interestPaid / 1e18)} {bonds.selectedActiveBond.tokenSymbol}</TableCell>
            </TableRow>
        );
    });

    return (
        <>
            <br></br>
            <br></br>
            <br></br>
            <div className="issuerDealList">
                <strong>Coupon Payment</strong>
            </div>
            {
                bonds.couponsPaid.length > 0 &&
                <Table celled>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell textAlign="right">Issue Volume</TableHeaderCell>
                            <TableHeaderCell textAlign="center">Coupon rate</TableHeaderCell>
                            <TableHeaderCell textAlign="right">Total Interest Paid</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderedReceipt}
                    </TableBody>
                </Table>
            }
        </>
    );
}

export default BondsCouponsPaid;