import React from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import Formate from "../utils/Formate";

function ManagerListOfBonds() {
    const bonds = useSelector(state => {
        return state.bond;
    });

    const renderedBonds = bonds.bonds.map((bond, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">{bonds.bondsDealIDs[index]}</TableCell>
                <TableCell textAlign="left">{bond.isin}</TableCell>
                <TableCell textAlign="left">{bond.name}</TableCell>
                <TableCell textAlign="left">{bond.symbol}</TableCell>
                <TableCell positive textAlign="right">{Formate(bond.issueVolume)} {bonds.bondsCurrency[index]}</TableCell>
                <TableCell positive textAlign="right">{Formate(bond.denomination)} {bonds.bondsCurrency[index]}</TableCell>
                <TableCell warning textAlign="center">{bond.couponRate / 100}%</TableCell>
                <TableCell textAlign="center">{bond.couponFrequency}</TableCell>
                <TableCell positive textAlign="right">{(new Date(bond.maturityDate * 1000)).toLocaleDateString()}</TableCell>
            </TableRow>
        );
    });

    return (
        <>
            {
                bonds.bonds.length > 0 &&
                <>
                    <div className="managerDealList">
                        <strong>List of Bonds Issued</strong>
                    </div>
                    <div className="tab-scroll">
                        <Table padded>
                            <TableHeader className="header-sticky">
                                <TableRow>
                                    <TableHeaderCell textAlign="left">Deal ID</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">ISIN</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Name</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Symbol</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Denomination</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Coupon</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Frequency</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Maturity</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedBonds}
                            </TableBody>
                        </Table>
                    </div>
                </>
            }
        </>
    )
}

export default ManagerListOfBonds;