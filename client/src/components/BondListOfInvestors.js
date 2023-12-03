import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";

function BondListOfInvestors() {
    let bonds = useSelector(state => {
        return state.bond;
    });

    let totalInterest = 0;
    for(let i = 0; i < bonds.investorsForSelectedActiveDeal.length; i++) {
        totalInterest += bonds.investorsForSelectedActiveDeal[i]
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>ISIN</TableHeaderCell>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Denomination</TableHeaderCell>
                        <TableHeaderCell>Volume</TableHeaderCell>
                        <TableHeaderCell>Coupon</TableHeaderCell>
                        <TableHeaderCell>Maturity</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>ISIN</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Denomination</TableCell>
                        <TableCell>Volume</TableCell>
                        <TableCell>Coupon</TableCell>
                        <TableCell>Maturity</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

export default BondListOfInvestors;