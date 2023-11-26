import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, GridColumn, GridRow, Input, Modal, ModalActions, ModalContent, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import BondFactoryJSON from "../contracts/artifacts/contracts/Topos/Factory/BondFactory.sol/BondFactory.json";
import IssuerJSON from "../contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import TokenCallJSON from "../contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import Formate from "../utils/Formate";
import Addresses from "../addresses/addr.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import "../users.css";
import "../manager.css";
import { setApprovedDeals, setBonds, setBondsCurrency, setBondsDealIDs, setBondsIssuers, setIssuersForApprovedDelas, setIssuersNameForApprovedDeals, setLoading, setShowIssueDealForm, setTokenSymbolForApprovedDeals } from "../store";

function IssueDealForm() {
    const [loader, setLoader] = useState(true);
    const [showBondForm, setShowBondForm] = useState(true);
    const [bondContractDeployed, setBondContractDeployed] = useState(false);
    const [bondISIN, setBondISIN] = useState('');
    const [bondName, setBondName] = useState('');
    const [bondSymbol, setBondSymbol] = useState('');
    const [bondContract, setBondContract] = useState('');
    const [open, setOpen] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('');

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const deploy = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let bondFactory = await getContract(web3, BondFactoryJSON, Addresses.BondFactoryContract);

        await bondFactory.methods.DeployBondContract(
            bonds.dealToIssue.dealID,
            bonds.dealToIssue.issuerAddress,
            Addresses.ToposBankContract,
            bonds.countryForDealToIssue
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Deploying the Bond Contract: ERC-7092! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Bond Contract Deployed! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        let _bondContract = await bankContract.methods.dealBondContracts(bonds.dealToIssue.dealID).call({ from: account });

        setBondContractDeployed(true);
        setBondContract(_bondContract);
    }

    const issue = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);

        let issueDate = Date.now() / 1000;

        let bond = {
            isin: bondISIN,
            name: bondName,
            symbol: bondSymbol,
            currency: bonds.dealToIssue.currency,
            denomination: bonds.dealToIssue.denomination,
            issueVolume: bonds.dealToIssue.debtAmount,
            couponRate: bonds.dealToIssue.couponRate,
            couponType: bonds.dealToIssue.couponType,
            couponFrequency: bonds.dealToIssue.couponFrequency,
            issueDate: Math.floor(issueDate) + '',
            maturityDate: bonds.dealToIssue.maturityDate
        }

        setLoadingMessage('');
        setLoader(true);
        dispatch(setLoading(true));

        await bankContract.methods.issue(
            bonds.dealToIssue.dealID,
            bond,
            bondContract
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Issuing Bonds To Investors! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Bonds Issued To Investors! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        let deals = await bankContract.methods.getListOfDeals().call({ from: account });
        let newBonds = await bankContract.methods.getListOfBonds().call({ from: account });
        let bondsDealIDs = await bankContract.methods.getListOfBondsDealIDs().call({ from: account });

        //=== store bonds currency symbols
        let approvedDeals = [];
        let issuersForApprovedDeals = [];
        let issuersNameForApprovedDeals = [];
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

        //============= HERE HERE
        let bondsIssuers = [];
        let bondsCurrency = [];
        for(let i = 0; i < bondsDealIDs.length; i++) {
          let deal = await bankContract.methods.deals(bondsDealIDs[i]).call({ from: account });
          let issuerAddress = deal.issuerAddress;
          let currency = deal.currency;

          let issuer = await issuerContract.methods.issuers(issuerAddress).call({ from: account });

          let tokenSymbol = await tokenCallContract.methods.symbol(currency).call({ from: account });

          bondsIssuers.push(issuer);
          bondsCurrency.push(tokenSymbol);
        }

        dispatch(setApprovedDeals(approvedDeals));
        dispatch(setIssuersForApprovedDelas(issuersForApprovedDeals));
        dispatch(setIssuersNameForApprovedDeals(issuersNameForApprovedDeals));
        dispatch(setTokenSymbolForApprovedDeals(tokenSymbolForApprovedDeals));
        dispatch(setBonds(newBonds));
        dispatch(setBondsDealIDs(bondsDealIDs));
        dispatch(setBondsIssuers(bondsIssuers));
        dispatch(setBondsCurrency(bondsCurrency));

        setBondContractDeployed(false);
        setShowBondForm(false);
        dispatch(setShowIssueDealForm(false));
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return (
        <>
            <div>
                <Table padded>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell textAlign="left">Deal ID</TableHeaderCell>
                            <TableHeaderCell textAlign="left">Issuer</TableHeaderCell>
                            <TableHeaderCell textAlign="left">Country</TableHeaderCell>
                            <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                            <TableHeaderCell textAlign="center">Coupon Rate</TableHeaderCell>
                            <TableHeaderCell textAlign="right">Maturity Date</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{bonds.dealToIssue.dealID}</TableCell>
                            <TableCell warning>{bonds.issuerNameForDealToIssue}</TableCell>
                            <TableCell>{bonds.countryForDealToIssue}</TableCell>
                            <TableCell positive textAlign="right">{Formate(bonds.dealToIssue.debtAmount)} {bonds.currencyForDealToIssue}</TableCell>
                            <TableCell warning textAlign="center">{bonds.dealToIssue.couponRate / 100}%</TableCell>
                            <TableCell textAlign="right">{(new Date(bonds.dealToIssue.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="deploy-bond-contract">
                <div className="deploy-bond-head">
                    Deploy the Bond Contract for {bonds.dealToIssue.dealID}
                </div>
                <br></br>
                <br></br>
                <div className="deal-button">
                    <Modal
                        size="tiny"
                        open={open}
                        trigger={
                            <Button type='submit' color="vk" fluid size='large' onClick={deploy}>
                                Deploy
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
                                        <Button inverted basic loading size="massive">Loading</Button>
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
                </div>
            </div>
            {
                bondContractDeployed &&
                <div className="deploy-bond-contract">
                    <div className="bond-conctract-deployed">
                        Bond Contract Deployed at: <strong>{bondContract}</strong>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="issue-bonds-head">
                            Issue Bonds for {bonds.dealToIssue.dealID}
                    </div>
                    <div className="deal-form">
                        <Grid stackable columns={3}>
                            <GridRow>
                                <GridColumn>
                                    <Input
                                        fluid
                                        size="mini"
                                        placeholder='Bond ISIN'
                                        value={bondISIN}
                                        onChange={e => setBondISIN(e.target.value)}
                                    />
                                </GridColumn>
                                <GridColumn>
                                    <Input
                                        fluid
                                        size="mini"
                                        placeholder='Bond Name'
                                        value={bondName}
                                        onChange={e => setBondName(e.target.value)}
                                    />
                                </GridColumn>
                                <GridColumn>
                                    <Input
                                        fluid
                                        size="mini"
                                        placeholder='Bond Symbol'
                                        value={bondSymbol}
                                        onChange={e => setBondSymbol(e.target.value)}
                                    />
                                </GridColumn>
                            </GridRow>
                        </Grid>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="deal-button">
                        <Modal
                            size="tiny"
                            open={open}
                            trigger={
                                <Button type='submit' color="vk" fluid size='large' onClick={issue}>
                                    Submit
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
                                            <Button inverted basic loading size="massive">Loading</Button>
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
                    </div>
                </div>
            }
        </>
    );
}

export default IssueDealForm;