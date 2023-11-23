import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import TokenCallJSON from "../contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import IssuerJSON from "../contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { Button, Card, CardContent, Input, Image, List, ListContent, ListItem, Modal, ModalActions, ModalContent } from "semantic-ui-react";
import { setApprovedDeals, setIssuersForApprovedDelas, setIssuersNameForApprovedDeals, setLoading, setSelectedDealID, setShowInvestForm, setTokenSymbolForApprovedDeals } from "../store";
import Addresses from "../addresses/addr.json";
import "../manager.css";
import "../users.css";
import Formate from "../utils/Formate";

function InvestInDeal() {
    const [amount, setAmount] = useState('');
    const [loader, setLoader] = useState(true);
    const [open, setOpen] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const invest = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        if(bonds.selectedDealID === '' || bonds.selectedDealID === '0') {
            return;
        }

        await bankContract.methods.registerForDeal(bonds.selectedDealID, amount)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Transaction in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Transaction Completed! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });


        let deals = await bankContract.methods.getListOfDeals().call({ from: account });

        let issuersNameForApprovedDeals = [];
        let approvedDeals = [];
        let issuersForApprovedDeals = [];
        let tokenSymbolForApprovedDeals = [];
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
        }

        setAmount('');

        dispatch(setApprovedDeals(approvedDeals));
        dispatch(setIssuersForApprovedDelas(issuersForApprovedDeals));
        dispatch(setIssuersNameForApprovedDeals(issuersNameForApprovedDeals));
        dispatch(setTokenSymbolForApprovedDeals(tokenSymbolForApprovedDeals));
        dispatch(setSelectedDealID(''));
        dispatch(setShowInvestForm(false));
    };

    const cancel = async () => {
        dispatch(setSelectedDealID(''));
        dispatch(setShowInvestForm(false));
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return (
        <div className="list-card">
            <div className="managerDealList">
                <strong>Invest in {bonds.selectedDealID}</strong>
            </div>
            <Card fluid>
                <CardContent>
                    <List relaxed='very'>
                        <ListItem>
                            <List.Icon name='user' size='large' verticalAlign='middle' />
                            <ListContent textAlign="right">{bonds.selectedDealIssuerName}</ListContent>
                        </ListItem>
                        <ListItem>
                            <ListContent>
                                <h4>Volume</h4> {Formate(bonds.selectedDealVolume)} {bonds.selectedDealTokenSymbol}
                            </ListContent>
                        </ListItem>
                        <ListItem>
                            <ListContent>
                                <h4>Denomination</h4> {Formate(bonds.selectedDealDenomination)} {bonds.selectedDealTokenSymbol}
                            </ListContent>
                        </ListItem>
                        <ListItem>
                            <ListContent>
                                <h4>Coupon rate</h4> {Formate(bonds.selectedDealCouponRate) / 100}%
                            </ListContent>
                        </ListItem>
                        <ListItem>
                            <ListContent>
                                <h4>Maturity Date</h4> {(new Date(bonds.selectedDealMaturityDate * 1000)).toLocaleDateString()}
                            </ListContent>
                        </ListItem>
                    </List>
                    <br></br>
                    <br></br>
                    <Input
                        fluid
                        action={bonds.selectedDealTokenSymbol}
                        size="large"
                        placeholder='Amount to Invest'
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    <br></br>
                    <Modal
                        size="tiny"
                        open={open}
                        trigger={
                            <Button type='submit' primary fluid size='large' onClick={invest}>
                                Invest
                            </Button>
                        }
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                    >
                        <ModalContent>
                            <div style={{ textAlign: 'center' }}>
                                <h3>{loadingMessage}</h3>
                                {
                                    loader ?
                                        <Button inverted basic loading size="massive">processing</Button>
                                    :
                                        <p style={{ color: 'green' }}><strong>transaction processed successfully</strong></p>
                                }
                            </div>
                        </ModalContent>
                        <ModalActions>
                            <Button basic floated="left" onClick={goToExplorer}>
                                <strong>Check on Topos Explorer</strong>
                            </Button>
                            <Button color='black' onClick={() => setOpen(false)}>
                                Go to Dashboard
                            </Button>
                        </ModalActions>
                    </Modal>
                    <br></br>
                    <Button color="red" onClick={cancel}>
                        Cancel
                    </Button>
                </CardContent>
            </Card>
        </div>
            
    );
}

export default InvestInDeal;