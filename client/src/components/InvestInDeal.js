import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BankJSON from "../../src/contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import TokenCallJSON from "../../src/contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import IssuerJSON from "../../src/contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import USDCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/USDC.sol/USDC.json";
import USDTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/USDT.sol/USDT.json";
import EURCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/EURC.sol/EURC.json";
import EURTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/EURT.sol/EURT.json";
import CNYCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/CNYC.sol/CNYC.json";
import CNYTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/CNYT.sol/CNYT.json";
import DAIJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/DAI.sol/DAI.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { Button, Card, CardContent, Input, List, ListContent, ListItem, Modal, ModalActions, ModalContent } from "semantic-ui-react";
import { setApprovedDeals, setDealsToIssue, setIssuersForApprovedDelas, setIssuersNameForApprovedDeals, setLoading, setSelectedDealID, setSelectedDealRemainingAmount, setShowInvestForm, setTokenSymbolForApprovedDeals } from "../store";
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

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const invest = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        let tokenContract = null;

        if(bonds.selectedDealTokenSymbol === "USDC") {
            tokenContract = await getContract(web3, USDCJSON, Addresses.USDCContract);
        }
        if(bonds.selectedDealTokenSymbol === "USDT") {
            tokenContract = await getContract(web3, USDTJSON, Addresses.USDTContract);
        }
        if(bonds.selectedDealTokenSymbol === "EURC") {
            tokenContract = await getContract(web3, EURCJSON, Addresses.EURCContract);
        }
        if(bonds.selectedDealTokenSymbol === "EURT") {
            tokenContract = await getContract(web3, EURTJSON, Addresses.EURTContract);
        }
        if(bonds.selectedDealTokenSymbol === "CNYC") {
            tokenContract = await getContract(web3, CNYCJSON, Addresses.CNYCContract);
        }
        if(bonds.selectedDealTokenSymbol === "CNYT") {
            tokenContract = await getContract(web3, CNYTJSON, Addresses.CNYTContract);
        }
        if(bonds.selectedDealTokenSymbol === "DAI") {
            tokenContract = await getContract(web3, DAIJSON, Addresses.DAIContract);
        }

        if(bonds.selectedDealID === '' || bonds.selectedDealID === '0') {
            return;
        }

        let amountToApprove = web3.utils.toWei(amount, 'ether');

        await tokenContract.methods.approve(Addresses.ToposBankContract, amountToApprove)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Approve Bank Contract in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Approve Bank Contract Completed! ✅');
            });


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
        let dealsToIssue = [];
        for(let i = 0; i < deals.length; i++) {
          let tokenAddress = deals[i].currency;
          let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });

          let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });

          if(deals[i].status === "2") {
            let issuerForApprovedDeals = issuer;

            let dealID = deals[i].dealID;
            let dealDebtAmount = deals[i].debtAmount;
            let totalAmountInvested = await bankContract.methods.totalAmountInvestedForDeal(dealID).call({ from: account });

            approvedDeals.push(deals[i]);
            issuersForApprovedDeals.push(issuerForApprovedDeals);
            issuersNameForApprovedDeals.push(issuer.name);
            tokenSymbolForApprovedDeals.push(tokenSymbol);

            if (dealDebtAmount === totalAmountInvested) {
                dealsToIssue.push(dealID);
            }
          }
        }

        let totalAmountInvested = await bankContract.methods.totalAmountInvestedForDeal(bonds.selectedDealID).call({ from: account });
        let remainingAmount =  bonds.selectedDealVolume - totalAmountInvested;

        setAmount('');

        dispatch(setDealsToIssue(dealsToIssue));
        dispatch(setApprovedDeals(approvedDeals));
        dispatch(setIssuersForApprovedDelas(issuersForApprovedDeals));
        dispatch(setIssuersNameForApprovedDeals(issuersNameForApprovedDeals));
        dispatch(setTokenSymbolForApprovedDeals(tokenSymbolForApprovedDeals));
        dispatch(setSelectedDealRemainingAmount(remainingAmount));
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
                            <ListContent><h3>{bonds.selectedDealIssuerName}</h3></ListContent>
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
                            <ListItem>
                            <div style={{ textAlign: 'center'}}>
                                <br></br>
                                <ListContent>

                                <h4>Remaining Amount to Raise</h4>
                                <span className="amount-remaining">
                                    {Formate(bonds.selectedDealRemainingAmount)}
                                </span>
                                <span>{bonds.selectedDealTokenSymbol}</span>
                                </ListContent>
                             </div>
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