import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Image, Table, TableRow, TableCell, TableHeader, TableHeaderCell, TableBody, Icon, Button, Modal, ModalContent, ModalActions } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import TokenCallJSON from "../contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import IssuerJSON from "../contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Formate from "../utils/Formate";
import Addresses from "../../src/addresses/addr.json";
import { setApprovedDeals, setBalance, setBondSymbols, setDeals, setIssuersForApprovedDelas, setIssuersNameForApprovedDeals, setLoading, setTokenSymbolForApprovedDeals } from "../store";
import "../users.css";
import "../manager.css";

function ManagerListOfDeals() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

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

    const status = connection.deals.map((deal, index) => {
        if(deal.status === '1') {
            return <Icon key={index} color="yellow" name="hourglass outline" />;
        } else if(deal.status === '2') {
            return <Icon key={index} color='yellow' name='checkmark' />;
        } else if(deal.status === '3') {
            return <Icon key={index} color='red' name='times circle' />;
        } else if(deal.status === '4') {
            return <Icon key={index} color='green' name='shop' />;
        } else {
            return <Icon key={index} color='yellow' name='checked calendar' />;
        }
    });

    const statusApprove = connection.deals.map((deal, index) => {
        if(deal.status === '1') {
            return (
                <Modal
                    size="tiny"
                    open={open}
                    trigger={
                        <Button
                            key={index}
                            compact
                            color='vk'
                            onClick={() => approve(deal.dealID)}
                        >
                            Approve
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
                        <Button color='black' onClick={goToDashboard}>
                            Go to Dashboard
                        </Button>
                    </ModalActions>
                </Modal>                
            ) 
        } else if(deal.status === '2') {
            return <Icon key={index} color='green' name='checkmark' />;
        } else if(deal.status === '3') {
            return '-';
        } else {
            return <Icon  key={index} color='green' name='checkmark' />;
        }
    });

    const statusReject = connection.deals.map((deal, index) => {
        if(deal.status === '1') {
            return (
                <Modal
                    size="tiny"
                    open={open}
                    trigger={
                        <Button
                            key={index}
                            compact
                            color='red'
                            onClick={() => reject(deal.dealID)}
                        >
                            Reject
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
                        <Button color='black' onClick={goToDashboard}>
                            Go to Dashboard
                        </Button>
                    </Modal.Actions>
                </Modal>
            ) 
        } else if(deal.status === '2') {
            return '-';
        } else if(deal.status === '3') {
            return <Icon key={index} color='red' name='times circle' />;
        } else {
            return '-';
        }
    });

    const approve = async dealID => {
        let {web3, account} = await web3Connection();
        let contract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        await contract.methods.approveDeal(dealID)
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

        
        let deals = await contract.methods.getListOfDeals().call({ from: account });
        let balance = await web3.eth.getBalance(account);
        balance = web3.utils.fromWei(balance);

        let bondSymbols = [];
        let issuersNameForApprovedDeals = [];
        let approvedDeals = [];
        let issuersForApprovedDeals = [];
        let tokenSymbolForApprovedDeals = [];

        for(let i = 0; i < deals.length; i++) {
            let tokenAddress = deals[i].currency;
            let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
            let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });

            bondSymbols.push(tokenSymbol);

            if(deals[i].status === "2") {
                let issuerForApprovedDeals = issuer;

                approvedDeals.push(deals[i]);
                issuersForApprovedDeals.push(issuerForApprovedDeals);
                issuersNameForApprovedDeals.push(issuer.name);
                tokenSymbolForApprovedDeals.push(tokenSymbol);
            }
        }

        dispatch(setDeals(deals));
        dispatch(setBalance(balance));
        dispatch(setBondSymbols(bondSymbols));
        dispatch(setApprovedDeals(approvedDeals));
        dispatch(setIssuersForApprovedDelas(issuersForApprovedDeals));
        dispatch(setIssuersNameForApprovedDeals(issuersNameForApprovedDeals));
        dispatch(setTokenSymbolForApprovedDeals(tokenSymbolForApprovedDeals));

        return;
    }

    const reject = async dealID => {
        let {web3, account} = await web3Connection();
        let contract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        await contract.methods.rejectDeal(dealID)
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

        
        let deals = await contract.methods.getListOfDeals().call({ from: account });
        let balance = await web3.eth.getBalance(account);
        balance = web3.utils.fromWei(balance);

        let bondSymbols = [];
        let issuersNameForApprovedDeals = [];
        let approvedDeals = [];
        let issuersForApprovedDeals = [];
        let tokenSymbolForApprovedDeals = [];

        for(let i = 0; i < deals.length; i++) {
            let tokenAddress = deals[i].currency;
            let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
            let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });

            bondSymbols.push(tokenSymbol);

            if(deals[i].status === "2") {
                let issuerForApprovedDeals = issuer;

                approvedDeals.push(deals[i]);
                issuersForApprovedDeals.push(issuerForApprovedDeals);
                issuersNameForApprovedDeals.push(issuer.name);
                tokenSymbolForApprovedDeals.push(tokenSymbol);
            }
        }

        dispatch(setDeals(deals));
        dispatch(setBalance(balance));
        dispatch(setBondSymbols(bondSymbols));
        dispatch(setApprovedDeals(approvedDeals));
        dispatch(setIssuersForApprovedDelas(issuersForApprovedDeals));
        dispatch(setIssuersNameForApprovedDeals(issuersNameForApprovedDeals));
        dispatch(setTokenSymbolForApprovedDeals(tokenSymbolForApprovedDeals));

        return;
    }


    const couponType = connection.deals.map((deal, index) => {
        if(deal.couponType === '0') {
            return <span>Zero Coupon</span>
        } else if(deal.couponType === '1') {
            return <span>Fixed Rate</span>
        } else {
            return <span>Floating Rate</span>
        }
    });

    const renderedDeals = connection.deals.map((deal, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">
                    <Image
                        size='tiny'
                        src={bonds.issuersLogo[index]}
                    />
                </TableCell>
                <TableCell textAlign="left">{deal.dealID}</TableCell>
                <TableCell textAlign="left"><a href={deal.prospectusURI} target="_blank" rel="noopener noreferrer"><strong>{deal.dealID.toLowerCase()}</strong></a></TableCell>
                <TableCell positive textAlign="right">{Formate(deal.debtAmount)} {bonds.bondSymbols[index]}</TableCell>
                <TableCell positive textAlign="right">{Formate(deal.denomination)} {bonds.bondSymbols[index]}</TableCell>
                <TableCell warning textAlign="center">{deal.couponRate / 100}%</TableCell>
                <TableCell textAlign="center">{deal.couponFrequency}</TableCell>
                <TableCell warning textAlign="center">{couponType[index]}</TableCell>
                <TableCell positive textAlign="right">{(new Date(deal.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                <TableCell textAlign="center">{statusApprove[index]}</TableCell>
                <TableCell textAlign="center">{statusReject[index]}</TableCell>
                <TableCell textAlign="center">{status[index]}</TableCell>
            </TableRow>
        );
    });

    return (
        <>
            <div className="managerDealList">
                <strong>Approve or Reject Deals</strong>
            </div>
            {
                connection.deals.length > 0 ?
                    <div className="tab-scroll">
                        <Table padded selectable>
                            <TableHeader className="header-sticky">
                                <TableRow>
                                    <TableHeaderCell textAlign="left">Issuer</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Deal ID</TableHeaderCell>
                                    <TableHeaderCell textAlign="left">Prospectus</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Denomination</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Coupon</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Frequency</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Type</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Maturity</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Approve</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Reject</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Status</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedDeals}
                            </TableBody>
                        </Table>
                    </div>
                :
                    <div  className="no-deal">
                        No Deal Found
                    </div>
            }
        </>
    );
}

export default ManagerListOfDeals;