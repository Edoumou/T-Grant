import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Button, Card, CardContent, Dropdown, Grid, GridColumn, GridRow, Modal } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import IssuerJSON from "../contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import TokenCallJSON from "../contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import Formate from "../utils/Formate";
import Addresses from "../addresses/addr.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setActiveBondsDealID, setApprovedDeals, setDealsFund, setIssuersForApprovedDelas, setIssuersNameForApprovedDeals, setLoading, setTokenSymbolForApprovedDeals } from "../store";
import "../users.css";
import "../manager.css";

function RedeemBonds() {
    const [dealID, setDealID] = useState('');
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(true);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const caseSensitiveSearch = (bondsOption, query) => {
        const re = new RegExp(_.escapeRegExp(query))
        return bondsOption.filter((opt) => re.test(opt.text))
    }

    const bondsOption = [];
    for (let i = 0; i < bonds.activeBondsDealID.length; i++) {
        bondsOption.push(
            {
                key: i+1,
                text:  bonds.activeBondsDealID[i],
                value: bonds.activeBondsDealID[i]
            }
        );
    }

    const redeem = async () => {
        let { web3, account } = await web3Connection();
        let bank = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);

        let bondContract = await bank.methods.dealBondContracts(dealID).call({ from: account });

        await bank.methods.redeem(dealID, bondContract)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Redeeming Bonds! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Bonds Redeemed! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        let deals = await bank.methods.getListOfDeals().call({ from: account });

        let issuersNameForApprovedDeals = [];
        let approvedDeals = [];
        let issuersForApprovedDeals = [];
        let tokenSymbolForApprovedDeals = [];
        let activeBondsDealID = [];
        for(let i = 0; i < deals.length; i++) {
            let tokenAddress = deals[i].currency;
            let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
            let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });

            if(deals[i].status === "2") {
                let issuerForApprovedDeals = issuer;

                approvedDeals.push(deals[i]);
                issuersForApprovedDeals.push(issuerForApprovedDeals);
                issuersNameForApprovedDeals.push(issuer.name);
                tokenSymbolForApprovedDeals.push(tokenSymbol);
              }

              if(deals[i].status === "4") {
                activeBondsDealID.push(deals[i].dealID);
              }
        }

        dispatch(setApprovedDeals(approvedDeals));
        dispatch(setIssuersForApprovedDelas(issuersForApprovedDeals));
        dispatch(setIssuersNameForApprovedDeals(issuersNameForApprovedDeals));
        dispatch(setTokenSymbolForApprovedDeals(tokenSymbolForApprovedDeals));
        dispatch(setActiveBondsDealID(activeBondsDealID));
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
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
            <div className="transfer-fund">
                <div className="fund-head">Redeem Bonds</div>
                <div className="list-card">
                    <Card fluid className="account-check">
                        <CardContent textAlign="center">
                            <h3><strong>Select Deal</strong></h3>
                            <Dropdown
                                placeholder="Select"
                                options={bondsOption}
                                search={caseSensitiveSearch}
                                onChange={(e, data) => setDealID(data.value)}
                            />
                            <br></br>
                            <br></br>
                            <Modal
                                size="tiny"
                                open={open}
                                trigger={
                                    <Button
                                        compact
                                        color="orange"
                                        size="large"
                                        onClick={redeem}
                                    >
                                        Redeem
                                    </Button>
                                }
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                            >
                                <Modal.Content>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3>{loadingMessage}</h3>
                                        {
                                            loader ?
                                                <Button inverted basic loading size="massive">processing</Button>
                                            :
                                                <p style={{ color: 'green' }}><strong>transaction processed successfully</strong></p>
                                        }
                                    </div>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button basic floated="left" onClick={goToExplorer}>
                                        <strong>Check on Topos Explorer</strong>
                                    </Button>
                                    <Button color='black' onClick={() => setOpen(false)}>
                                        Go to Dashboard
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default RedeemBonds;