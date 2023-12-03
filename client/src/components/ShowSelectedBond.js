import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import Formate from "../utils/Formate";

function ShowSelectedBond() {
    let bonds = useSelector(state => {
        return state.bond;
    });

    let totalInterest = 0;
    for(let i = 0; i < bonds.investorsForSelectedActiveDeal.length; i++) {
        totalInterest += bonds.investorsForSelectedActiveDeal[i]
    }

    return (
        <div>
            <Table padded selectable>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>ISIN</TableHeaderCell>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell textAlign="right">Denomination</TableHeaderCell>
                        <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                        <TableHeaderCell textAlign="center">Coupon</TableHeaderCell>
                        <TableHeaderCell textAlign="right">Maturity</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        Number(bonds.selectedActiveBond.issueVolume) > 0 ?
                            <TableRow>
                                <TableCell>{bonds.selectedActiveBond.isin}</TableCell>
                                <TableCell>{bonds.selectedActiveBond.name}</TableCell>
                                <TableCell textAlign="right">{Formate(bonds.selectedActiveBond.denomination)} {bonds.selectedActiveBond.tokenSymbol}</TableCell>
                                <TableCell textAlign="right">{Formate(bonds.selectedActiveBond.issueVolume)} {bonds.selectedActiveBond.tokenSymbol}</TableCell>
                                <TableCell warning textAlign="center">{bonds.selectedActiveBond.couponRate / 100}%</TableCell>
                                <TableCell positive textAlign="right">{
                                    (new Date(bonds.selectedActiveBond.maturityDate * 1000)).toLocaleDateString()
                                }</TableCell>
                            </TableRow>
                        :
                            <TableRow>
                                <TableCell>{bonds.selectedActiveBond.isin}</TableCell>
                                <TableCell>{bonds.selectedActiveBond.name}</TableCell>
                                <TableCell textAlign="right">{'0,00'}</TableCell>
                                <TableCell textAlign="right">{'0,00'}</TableCell>
                                <TableCell warning textAlign="center">{'0,0'}%</TableCell>
                                <TableCell positive textAlign="right">{'dd/mm/yy'}</TableCell>
                            </TableRow>
                    }
                </TableBody>
            </Table>
        </div>
    );
}

export default ShowSelectedBond;