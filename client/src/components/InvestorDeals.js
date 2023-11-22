import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridRow, GridColumn } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";
import Addresses from "../../src/addresses/addr.json";
import "../users.css";
import "../manager.css";
import { setBalance, setDeals, setLoading } from "../store";
import AccountCheck from "./AccountCheck";
import IssuersList from "./IssuersList";
import InvestorsList from "./InvestorsList";
import DealSideBar from "./DealSideBar";
import InvestInDeal from "./InvestInDeal";
import ListOfApprovedDeals from "./ListOfApprovedDeals";
import InvestorRegisteredDeals from "./InvestorRegisteredDeals";

function InvestorDeals() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const issuer = useSelector(state => {
        return state.issuer;
    });

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const [alertMessage, setAlertMessage] = useState('');
    const [loader, setLoader] = useState(true);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');
    const [open, setOpen] = useState(false);

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    const goToDashboard = () => {
        setOpen(false);
        setLoader(true);
        setLoadingMessage('');
        setExplorerLink('');
    }

    return (
        <div className="manager">
            <div className="manager-head">
                <Grid columns={2}>
                    <GridRow>
                        <GridColumn textAlign="left">
                            <strong>{connection.role}</strong>
                        </GridColumn>
                        <GridColumn textAlign="right">
                            <strong>{Number(connection.balance).toFixed(2)} TOPOS</strong>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
            <div className="manager-body">
                <Grid stackable columns={2}>
                    <GridRow>
                        <GridColumn width={12}>
                            <ListOfApprovedDeals />
                            <InvestorRegisteredDeals />
                        </GridColumn>
                        <GridColumn width={4}>
                            <InvestInDeal />
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </div>
    );
}

export default InvestorDeals;