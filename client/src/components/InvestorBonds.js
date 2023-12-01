import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import BondCallJSON from "../contracts/artifacts/contracts/BondCall.sol/BondCall.json";
import TokenCallJSON from "../contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import IssuerJSON from "../contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import { Button, Card, CardContent, CardDescription, CardMeta, Grid, GridColumn, GridRow, Image, Input, List, ListContent, ListDescription, ListIcon, ListItem, Modal, ModalActions, ModalContent } from "semantic-ui-react";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../addresses/addr.json";
import Formate from "../utils/Formate";
import "../users.css";
import "../manager.css";
import { setInvestorBonds, setInvestorBondsIssuers, setLoading } from "../store";

function InvestorBonds() {
    const [bondClicked, setBondClicked] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedDealID, setSelectedDealID] = useState('');
    const [issuerName, setIssuerName] = useState('');
    const [issuerLogo, setIssuerLogo] = useState('');
    const [bondDealID, setBondDealID] = useState('');
    const [bondName, setBondName] = useState('');
    const [bondSymbol, setBondSymbol] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [couponRate, setCouponRate] = useState('');
    const [maturityDate, setMaturityDate] = useState('');
    const [denomination, setDenomination] = useState('');
    const [principal, setPrincipal] = useState('');
    const [amountToTransfer, setAmountToTransfer] = useState('');
    const [amountToApprove, setAmountToAppove] = useState('');
    const [tokenOwnerAddress, setTokenOwnerAddress] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [explorerLink, setExplorerLink] = useState('');
    const [loader, setLoader] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('');

    const [showApprove, setShowApprove] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showTransferFrom, setShowTransferFrom] = useState(false);

    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.investor.investorBonds;
    });

    const issuers = useSelector(state => {
        return state.investor.investorBondsIssuers;
    });

    const dispatch = useDispatch();

    const makeAction = async (
        _issuerName,
        _issuerLogo,
        _bondDealID,
        _bondName,
        _couponRate,
        _maturityDate,
        _denomination,
        _bondSymbol,
        _tokenSymbol,
        _principal
    ) => {
        setBondClicked(true);

        setIssuerName(_issuerName);
        setIssuerLogo(_issuerLogo);
        setBondDealID(_bondDealID);
        setBondName(_bondName);
        setCouponRate(_couponRate);
        setMaturityDate(_maturityDate);
        setDenomination(_denomination);
        setBondSymbol(_bondSymbol);
        setTokenSymbol(_tokenSymbol);
        setPrincipal(_principal);
    }

    const renderedBonds = bonds.map((bond, index) => {
        return (
            <span className="bond-card" key={index}>
                <Card onClick={() => makeAction(
                    issuers[index].name,
                    issuers[index].logoURI,
                    bond.dealID,
                    bond.name,
                    bond.couponRate,
                    bond.maturityDate,
                    bond.denomination,
                    bond.symbol,
                    bond.tokenSymbol,
                    bond.principal
                )}>
                    <CardContent>
                        <Image
                            floated='left'
                            size='tiny'
                            src={issuers[index].logoURI}
                        />
                        
                        <div className="bond-head">
                            <strong>{issuers[index].name}</strong>
                        </div>
                        <br></br>
                        <CardMeta textAlign='right'><strong>{bonds[index].name}</strong></CardMeta>
                        <br></br>
                        <hr></hr>
                        <br></br>
                        <CardDescription className="card-desc" textAlign='left'>
                            Coupon Rate: <span style={{ paddingLeft: 5, color:'grey' }}><strong>{bonds[index].couponRate / 100}%</strong></span>
                            <br></br>
                            <br></br>
                            Maturity Date: <span style={{ paddingLeft: 5, color:'grey' }}>
                                    <strong>
                                        {(new Date(bonds[index].maturityDate * 1000)).toLocaleDateString()}
                                    </strong>
                                </span>
                            <br></br>
                            <br></br>
                            Balance: <span style={{ paddingLeft: 5, color:'grey' }}><strong>{Formate(bonds[index].principal / bonds[index].denomination)} {bonds[index].symbol}</strong></span>
                            <br></br>
                            <br></br>
                            <hr></hr>
                            <br></br>
                            Principal: <span style={{ paddingLeft: 5, color: 'purple' }}><strong>{Formate(bonds[index].principal)} {bonds[index].tokenSymbol}</strong></span>
                        </CardDescription>
                    </CardContent>  
                </Card>
            </span>
        );
    });

    const approve = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);

        let dealBondContract = await bankContract.methods.dealBondContracts(bondDealID).call({ from: account });


        await bondCallContract.methods.approve(
            recipientAddress,
            amountToApprove,
            dealBondContract
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Waiting for Approval Confirmation! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Address Approved! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        setLoadingMessage('');
        setLoader(false);
        setAmountToAppove('');
        setRecipientAddress('');

        setShowApprove(false);
        setShowTransfer(false);
        setShowTransferFrom(false);
    }

    const transfer = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        let deals = await bankContract.methods.getListOfDeals().call({ from: account });
        let dealBondContract = await bankContract.methods.dealBondContracts(bondDealID).call({ from: account });

        await bondCallContract.methods.transfer(
            recipientAddress,
            amountToTransfer,
            '0x',
            dealBondContract
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Waiting for Transfer Confirmation! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Bonds Transferred! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        setLoadingMessage('');
        setLoader(false);
        setAmountToTransfer('');
        setRecipientAddress('');

        let investorBonds = [];
        let investorBondsIssuers = [];
        for(let i = 0; i < deals.length; i++) {
            if(deals[i].status === "4") {
                let dealID = deals[i].dealID;
                let tokenAddress = deals[i].currency;
                let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
                let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });
                let address = await bankContract.methods.dealBondContracts(dealID).call({ from: account });

                let principal = await bondCallContract.methods.principalOf(account, address).call({ from: account });

                if(principal !== '0') {
                    let isin = await bondCallContract.methods.isin(address).call({ from: account });
                    let denomination = await bondCallContract.methods.denomination(address).call({ from: account });
                    let couponRate = await bondCallContract.methods.couponRate(address).call({ from: account });
                    let couponFrequency = await bondCallContract.methods.couponFrequency(address).call({ from: account });
                    let maturityDate = await bondCallContract.methods.maturityDate(address).call({ from: account });
                    let symbol = await bondCallContract.methods.symbol(address).call({ from: account });
                    let name = await bondCallContract.methods.name(address).call({ from: account });

                    investorBonds.push(
                        {
                        isin: isin,
                        dealID: dealID,
                        name: name,
                        symbol: symbol,
                        denomination: denomination.toString(),
                        couponRate: couponRate.toString(),
                        couponFrequency: couponFrequency.toString(),
                        maturityDate: maturityDate.toString(),
                        principal: principal.toString(),
                        tokenSymbol: tokenSymbol
                        }
                    );

                    investorBondsIssuers.push(issuer);
                }
            }
        }

        dispatch(setInvestorBonds(investorBonds));
        dispatch(setInvestorBondsIssuers(investorBondsIssuers));

        setShowApprove(false);
        setShowTransfer(false);
        setShowTransferFrom(false);
    }

    const transferFrom = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        let deals = await bankContract.methods.getListOfDeals().call({ from: account });
        let dealBondContract = await bankContract.methods.dealBondContracts(bondDealID).call({ from: account });

        await bondCallContract.methods.transferFrom(
            tokenOwnerAddress,
            recipientAddress,
            amountToTransfer,
            '0x',
            dealBondContract
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Waiting for Transfer Confirmation! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Bonds Transferred! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        setLoadingMessage('');
        setLoader(false);
        setAmountToTransfer('');
        setRecipientAddress('');

        let investorBonds = [];
        let investorBondsIssuers = [];
        for(let i = 0; i < deals.length; i++) {
            if(deals[i].status === "4") {
                let dealID = deals[i].dealID;
                let tokenAddress = deals[i].currency;
                let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
                let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });
                let address = await bankContract.methods.dealBondContracts(dealID).call({ from: account });

                let principal = await bondCallContract.methods.principalOf(account, address).call({ from: account });

                if(principal !== '0') {
                    let isin = await bondCallContract.methods.isin(address).call({ from: account });
                    let denomination = await bondCallContract.methods.denomination(address).call({ from: account });
                    let couponRate = await bondCallContract.methods.couponRate(address).call({ from: account });
                    let couponFrequency = await bondCallContract.methods.couponFrequency(address).call({ from: account });
                    let maturityDate = await bondCallContract.methods.maturityDate(address).call({ from: account });
                    let symbol = await bondCallContract.methods.symbol(address).call({ from: account });
                    let name = await bondCallContract.methods.name(address).call({ from: account });

                    investorBonds.push(
                        {
                        isin: isin,
                        dealID: dealID,
                        name: name,
                        symbol: symbol,
                        denomination: denomination.toString(),
                        couponRate: couponRate.toString(),
                        couponFrequency: couponFrequency.toString(),
                        maturityDate: maturityDate.toString(),
                        principal: principal.toString(),
                        tokenSymbol: tokenSymbol
                        }
                    );

                    investorBondsIssuers.push(issuer);
                }
            }
        }

        dispatch(setInvestorBonds(investorBonds));
        dispatch(setInvestorBondsIssuers(investorBondsIssuers));

        setShowApprove(false);
        setShowTransfer(false);
        setShowTransferFrom(false);
    }

    const cancel = async () => {
        setBondClicked(!bondClicked);
        setShowApprove(false);
        setShowTransfer(false);
        setShowTransferFrom(false);
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    const setApprove = async () => {
        setShowApprove(!showApprove);
        setShowTransfer(false);
        setShowTransferFrom(false);
    };

    const setTransfer = async () => {
        setShowApprove(false);
        setShowTransfer(!showTransfer);
        setShowTransferFrom(false);
    };

    const setTransferFrom = async () => {
        setShowApprove(false);
        setShowTransfer(false);
        setShowTransferFrom(!showTransferFrom);
    };

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
                {
                    !bondClicked ?
                        <Grid stackable>
                            <GridRow>
                                <GridColumn>
                                    <div className="user-bond-list ">
                                        <Grid stackable textAlign="right">
                                            {renderedBonds}
                                        </Grid>
                                    </div>
                                </GridColumn>
                            </GridRow>
                        </Grid>
                    :
                        <Grid stackable columns={2}>
                            <GridRow>
                                <GridColumn width={12}>
                                    <div className="user-bond-list ">
                                        <Grid stackable textAlign="right">
                                            {renderedBonds}
                                        </Grid>
                                    </div>
                                </GridColumn>
                                <GridColumn width={4}>
                                    <div className="list-card">
                                        <Card fluid>
                                            <CardContent>
                                                <List relaxed>
                                                    <ListItem onClick={setApprove}>
                                                        {
                                                            showApprove ?
                                                                <>
                                                                    <ListIcon name='caret down' size='large' />
                                                                    <ListContent>
                                                                        <ListDescription>Approve Bonds</ListDescription>
                                                                    </ListContent>
                                                                </>
                                                            :
                                                                <>
                                                                    <ListIcon name='caret right' size='large' verticalAlign='middle' />
                                                                    <ListContent>
                                                                        <ListDescription>Approve Bonds</ListDescription>
                                                                    </ListContent>
                                                                </>
                                                        }
                                                    </ListItem>
                                                    {
                                                        showApprove &&
                                                            <div className="list-card-action ">
                                                                <List relaxed='very'>
                                                                    <ListItem>
                                                                        <ListContent>
                                                                            <Image
                                                                                floated='right'
                                                                                size='tiny'
                                                                                src={issuerLogo}
                                                                            />
                                                                        </ListContent>
                                                                    </ListItem>
                                                                    <ListItem>
                                                                        <ListContent>
                                                                            <h4>Your Balance:</h4> <span>{Formate(principal / denomination)} {bondSymbol}</span>
                                                                        </ListContent>
                                                                    </ListItem>
                                                                </List>
                                                                <br></br>
                                                                <br></br>
                                                                <Input
                                                                    fluid
                                                                    size="large"
                                                                    placeholder='Account to Approve'
                                                                    value={recipientAddress}
                                                                    onChange={e => setRecipientAddress(e.target.value)}
                                                                />
                                                                <br></br>
                                                                <Input
                                                                    fluid
                                                                    action={bondSymbol}
                                                                    size="large"
                                                                    placeholder='Amount to Approve'
                                                                    value={amountToApprove}
                                                                    onChange={e => setAmountToAppove(e.target.value)}
                                                                />
                                                                <br></br>
                                                                <Modal
                                                                    size="tiny"
                                                                    open={open}
                                                                    trigger={
                                                                        <Button type='submit' primary fluid size='large' onClick={approve}>
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
                                                                        <Button color='black' onClick={() => setOpen(false)}>
                                                                            Go to Dashboard
                                                                        </Button>
                                                                    </ModalActions>
                                                                </Modal>
                                                                <br></br>
                                                                <Button color="red" onClick={cancel}>
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                    }
                                                    <ListItem onClick={setTransfer}>
                                                        {
                                                            showTransfer ?
                                                                <>
                                                                    <ListIcon name='caret down' size='large' />
                                                                    <ListContent>
                                                                        <ListDescription>Transfer Bonds</ListDescription>
                                                                    </ListContent>
                                                                </>
                                                            :
                                                                <>
                                                                    <ListIcon name='caret right' size='large' verticalAlign='middle' />
                                                                    <ListContent>
                                                                        <ListDescription>Transfer Bonds</ListDescription>
                                                                    </ListContent>
                                                                </>
                                                        }
                                                    </ListItem>
                                                    {
                                                        showTransfer &&
                                                            <div className="list-card-action">
                                                                <List relaxed='very'>
                                                                    <ListItem>
                                                                        <ListContent>
                                                                            <Image
                                                                                floated='right'
                                                                                size='tiny'
                                                                                src={issuerLogo}
                                                                            />
                                                                        </ListContent>
                                                                    </ListItem>
                                                                    <ListItem>
                                                                        <ListContent>
                                                                            <h4>Your Balance:</h4> <span>{Formate(principal / denomination)} {bondSymbol}</span>
                                                                        </ListContent>
                                                                    </ListItem>
                                                                </List>
                                                                <br></br>
                                                                <Input
                                                                    fluid
                                                                    size="large"
                                                                    placeholder='Recipient Address'
                                                                    value={recipientAddress}
                                                                    onChange={e => setRecipientAddress(e.target.value)}
                                                                />
                                                                <br></br>
                                                                <Input
                                                                    fluid
                                                                    action={bondSymbol}
                                                                    size="large"
                                                                    placeholder='Amount to Transfer'
                                                                    value={amountToTransfer}
                                                                    onChange={e => setAmountToTransfer(e.target.value)}
                                                                />
                                                                <br></br>
                                                                <Modal
                                                                    size="tiny"
                                                                    open={open}
                                                                    trigger={
                                                                        <Button type='submit' primary fluid size='large' onClick={transfer}>
                                                                            Transfer
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
                                                            </div>
                                                    }
                                                    <ListItem onClick={setTransferFrom}>
                                                        {
                                                            showTransferFrom ?
                                                                <>
                                                                    <ListIcon name='caret down' size='large' />
                                                                    <ListContent>
                                                                        <ListDescription>Transfer From an Account</ListDescription>
                                                                    </ListContent>
                                                                </>
                                                            :
                                                                <>
                                                                    <ListIcon name='caret right' size='large' verticalAlign='middle' />
                                                                    <ListContent>
                                                                        <ListDescription>Transfer Bonds From an Account</ListDescription>
                                                                    </ListContent>
                                                                </>
                                                        }
                                                    </ListItem>
                                                    {
                                                        showTransferFrom &&
                                                            <div className="list-card-action">
                                                                <List relaxed='very'>
                                                                    <ListItem>
                                                                        <ListContent>
                                                                            <Image
                                                                                floated='right'
                                                                                size='tiny'
                                                                                src={issuerLogo}
                                                                            />
                                                                        </ListContent>
                                                                    </ListItem>
                                                                </List>
                                                                <br></br>
                                                                <br></br>
                                                                <Input
                                                                    fluid
                                                                    size="large"
                                                                    placeholder='Token Owner Address'
                                                                    value={tokenOwnerAddress}
                                                                    onChange={e => setTokenOwnerAddress(e.target.value)}
                                                                />
                                                                <br></br>
                                                                <Input
                                                                    fluid
                                                                    size="large"
                                                                    placeholder='Recipient Address'
                                                                    value={recipientAddress}
                                                                    onChange={e => setRecipientAddress(e.target.value)}
                                                                />
                                                                <br></br>
                                                                <Input
                                                                    fluid
                                                                    action={bondSymbol}
                                                                    size="large"
                                                                    placeholder='Amount to transfer'
                                                                    value={amountToTransfer}
                                                                    onChange={e => setAmountToTransfer(e.target.value)}
                                                                />
                                                                <br></br>
                                                                <Modal
                                                                    size="tiny"
                                                                    open={open}
                                                                    trigger={
                                                                        <Button type='submit' primary fluid size='large' onClick={transferFrom}>
                                                                            transfer
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
                                                            </div>
                                                    }
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </GridColumn>
                            </GridRow>
                        </Grid>
                }
            </div>
        </div>
    );
}

export default InvestorBonds;