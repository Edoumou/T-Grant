import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardContent, CardDescription, CardMeta, Grid, GridColumn, GridRow, Image, Input, List, ListContent, ListDescription, ListIcon, ListItem, Modal, ModalActions, ModalContent } from "semantic-ui-react";
import Formate from "../utils/Formate";
import "../users.css";
import "../manager.css";

function InvestorBonds() {
    const [bondClicked, setBondClicked] = useState(false);
    const [open, setOpen] = useState(false);
    const [issuerName, setIssuerName] = useState('');
    const [issuerLogo, setIssuerLogo] = useState('');
    const [bondName, setBondName] = useState('');
    const [bondSymbol, setBondSymbol] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [couponRate, setCouponRate] = useState('');
    const [maturityDate, setMaturityDate] = useState('');
    const [denomination, setDenomination] = useState('');
    const [principal, setPrincipal] = useState('');
    const [amountToTransfer, setAmountToTransfer] = useState('');
    const [amountToApprove, setAmountToAppove] = useState('');
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

    const makeAction = async (
        _issuerName,
        _issuerLogo,
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
                    bonds[index].name,
                    bonds[index].couponRate,
                    bonds[index].maturityDate,
                    bonds[index].denomination,
                    bonds[index].symbol,
                    bonds[index].tokenSymbol,
                    bonds[index].principal
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

    const transfer = async () => {

    }

    const cancel = async () => {
        setBondClicked(!bondClicked);
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    const setApprove = async => {
        setShowApprove((!showApprove));
        setShowTransfer(false);
        setShowTransferFrom(false);
    };

    const setTransfer = async => {
        setShowApprove(false);
        setShowTransfer(!showTransfer);
        setShowTransferFrom(false);
    };

    const setTransferFrom = async => {
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
                                                                    <ListIcon name='caret down' size='large' verticalAlign='middle' />
                                                                    <ListContent>
                                                                        <ListDescription>Approve Bonds</ListDescription>
                                                                        Describe Everything
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
                                                    <ListItem onClick={setTransfer}>
                                                        {
                                                            showTransfer ?
                                                                <>
                                                                    <ListIcon name='caret down' size='large' />
                                                                    <ListContent>
                                                                        <ListDescription>Transfer Bonds</ListDescription>
                                                                            <div className="list-card">
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
                                                    <ListItem onClick={setTransferFrom}>
                                                        {
                                                            showTransferFrom ?
                                                                <>
                                                                    <ListIcon name='caret down' size='large' verticalAlign='middle' />
                                                                    <ListContent>
                                                                        <ListDescription>Approve Bonds</ListDescription>
                                                                        Describe Everything
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