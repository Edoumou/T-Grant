import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";

function BondListOfInvestors() {
    let bonds = useSelector(state => {
        return state.bond;
    });

    let totalInterest = 0;
    for(let i = 0; i < bonds.investorsForSelectedActiveDeal.length; i++) {
        totalInterest += bonds.investorsForSelectedActiveDeal[i].interest
    }

    const renderedInvestors = bonds.investorsForSelectedActiveDeal.map((investor, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">{FormateAddress(investor.address)}</TableCell>
                <TableCell warning textAlign="right">{Formate(investor.principal)} {investor.tokenSymbol}</TableCell>
                <TableCell positive textAlign="right">{Formate(investor.balance)} {investor.bondSymbol}</TableCell>
                <TableCell warning textAlign="right">{Formate(investor.interest)} {investor.tokenSymbol}</TableCell>
            </TableRow>
        );
    });

    return (
        <>
            {
                bonds.investorsForSelectedActiveDeal &&
                <>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className="issuerDealList">
                        <strong>List of Investors</strong>
                    </div>
                    <div className="tab-scroll">
                        <Table padded>
                            <TableHeader className="header-sticky">
                                <TableRow>
                                    <TableHeaderCell textAlign="left">Address</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Principal</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Balance</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Interest (1A)</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedInvestors}
                            </TableBody>
                            <TableFooter fullWidth>
                                <TableRow>
                                    <TableHeaderCell colSpan='3' />
                                    <TableHeaderCell textAlign="right">
                                        <strong style={{ color: 'darkred' }}>
                                            {Formate(totalInterest)} {bonds.selectedActiveBond.tokenSymbol}
                                        </strong>
                                    </TableHeaderCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </>
            }
        </>
    );
}

export default BondListOfInvestors;