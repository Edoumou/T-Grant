import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Button, Card, CardContent, Dropdown, Grid, GridColumn, GridRow, Modal } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import IssuersFundJSON from "../contracts/artifacts/contracts/treasury/IssuersFund.sol.sol/IssuersFund.json";
import Formate from "../utils/Formate";
import Addresses from "../addresses/addr.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setDealsFund, setLoading } from "../store";
import "../users.css";
import "../manager.css";

function DealsFund() {
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
    for (let i = 0; i < bonds.dealsFund.length; i++) {
        bondsOption.push(
            {
                key: i+1,
                text:  bonds.dealsFund[i],
                value: bonds.dealsFund[i]
            }
        );
    }

    const transfer = async () => {
        let { web3, account } = await web3Connection();
        let bank = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let issuersFundContract = await getContract(web3, IssuersFundJSON, Addresses.IssuersFundContract);

        await bank.methods.withdrawIssuerFund(dealID)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Sending Funds to Issuer! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Funds Transferred! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        let DealsFund = [];
        for(let i = 0; i < connection.deals.length; i++) {
            if(connection.deals[i].status === "4") {
                let funds = await issuersFundContract.methods.totalAmount(connection.deals[i].dealID).call({ from: account });

                if(Number(funds) !== 0) {
                    DealsFund.push(connection.deals[i].dealID);
                }
            }
        }

        dispatch(setDealsFund(DealsFund));
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
                <div className="fund-head">Transfer Deal Funds To Issuers</div>
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
                                        onClick={transfer}
                                    >
                                        Transfer
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

export default DealsFund;