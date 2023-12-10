import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Image, Button, Card, CardContent, Dropdown, Grid, GridColumn, GridRow, Modal, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Label, List, ListContent, ListItem, ModalContent, Input, ModalActions } from "semantic-ui-react";
import TokenCallJSON from "../../src/contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";
import Addresses from "../addresses/addr.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import "../users.css";
import "../manager.css";

function Exchange() {
    const [open, setOpen] = useState(false);
    const [bondSelected, setBondSelected] = useState({});
    const [showBuyBondsForm, setShowBuyBondsForm] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loader, setLoader] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [buyerTokenBalance, setBuyerTokenBalance] = useState('');
    const [amountToBuy, setAmountAmountToBuy] = useState(''); 
    
    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const buyBonds = async (index) => {
        let { web3, account } = await web3Connection();
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);

        let balance = await tokenCallContract.methods.balanceOf(
            account,
            bonds.dealsListed[index].currencyContract
        ).call({ from: account });

        balance = web3.utils.fromWei(balance, 'ether');


        setBondSelected(bonds.dealsListed[index]);
        setShowBuyBondsForm(true);
        setBuyerTokenBalance(balance);
    }

    const renderedBonds = bonds.dealsListed.map((list, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">
                    <Image
                        size='tiny'
                        src={list.logo}
                    />
                </TableCell>
                <TableCell textAlign='center'>
                    <a href={`https://topos.blockscout.testnet-1.topos.technology/address/${list.bondContract}`} target="_blank">
                        {FormateAddress(list.bondContract)}
                    </a>
                </TableCell>
                <TableCell textAlign='center'>{list.dealID}</TableCell>
                <TableCell textAlign='center'>
                    <a href={`https://topos.blockscout.testnet-1.topos.technology/address/${list.seller}`} target="_blank">
                        {FormateAddress(list.seller)}
                    </a>
                </TableCell>
                <TableCell textAlign='center'>{list.bondSymbol}</TableCell>
                <TableCell textAlign='center'>{Formate(list.quantity)}</TableCell>
                <TableCell textAlign='center'>{Formate(list.coupon / 100)}%</TableCell>
                <TableCell textAlign='center'>{(new Date(list.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                <TableCell textAlign='center'>{Formate(list.denomination)} {list.tokenSymbol}</TableCell>
                {
                    Number(list.price) > Number(list.denomination) ?
                        <TableCell textAlign='center'>
                            <span style={{ color: "red" }}><strong>{Formate(list.price)}</strong></span> {list.tokenSymbol}
                        </TableCell>
                    : Number(list.price) < Number(list.denomination) ?
                        <TableCell textAlign='center'>
                            <span style={{ color: "green" }}><strong>{Formate(list.price)}</strong></span> {list.tokenSymbol}
                        </TableCell>
                    :
                        <TableCell textAlign='center'>{Formate(list.price)} {list.tokenSymbol}</TableCell>
                }
                <TableCell>
                    {
                        connection.account.toLowerCase() !== list.seller.toLowerCase() &&
                        <Label
                            as='a'
                            ribbon='right'
                            color="orange"
                            onClick={() => buyBonds(index)}
                        >
                            <strong>Buy</strong>
                        </Label>
                    }
                </TableCell>
            </TableRow>
        );
    });

    const buy = async () => {

    }

    const cancel = async () => {
        setShowBuyBondsForm(false);
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return (
        <div className="exchange">
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
            <div>
                {
                    showBuyBondsForm ?
                        <>
                            <div className="buy-bond-head">
                                <h2>{bondSelected.bondName} Bond</h2>
                                <hr style={{ width: 450, marginTop: 20 }}></hr>
                            </div>
                            <div className="buy-bond-body">
                                <Grid columns={3}>
                                    <GridRow>
                                        <GridColumn textAlign='left'>
                                            <h4>Your Balance:</h4>
                                            <span>
                                                {Formate(buyerTokenBalance)} {bondSelected.tokenSymbol}
                                            </span>
                                        </GridColumn>
                                        <GridColumn textAlign='center'>
                                            <h4>Bond Price:</h4>
                                            <span>{Formate(bondSelected.price)} {bondSelected.tokenSymbol}</span>
                                        </GridColumn>
                                        <GridColumn textAlign='right'>
                                            <h4>Qty in Sell:</h4>
                                            <span>
                                                {Formate(bondSelected.quantity)} {bondSelected.bondSymbol}
                                            </span>
                                        </GridColumn>
                                    </GridRow>
                                </Grid>
                                <br></br>
                                <List relaxed='very'>
                                    <ListItem>
                                        <ListContent>
                                            <div style={{ textAlign: 'center'}}>
                                                <div style={{ marginBottom: 10 }}>
                                                    <div className="can-buy-color">
                                                        <strong>You can buy up To</strong>:
                                                    </div> 
                                                </div>
                                                {
                                                    Math.trunc(buyerTokenBalance / bondSelected.price) >= bondSelected.quantity ?
                                                        <>
                                                            {Formate(bondSelected.quantity)} {bondSelected.bondSymbol}
                                                        </>
                                                    :
                                                        <>
                                                            {Formate(Math.trunc(buyerTokenBalance / bondSelected.price))} {bondSelected.bondSymbol}
                                                        </>
                                                }
                                            </div>
                                        </ListContent>
                                    </ListItem>
                                </List>
                                <br></br>
                                <br></br>
                                <Input
                                    fluid
                                    action={bondSelected.bondSymbol}
                                    size="large"
                                    placeholder='Amount to buy'
                                    value={amountToBuy}
                                    onChange={e => setAmountAmountToBuy(e.target.value)}
                                />
                                <br></br>
                                <Modal
                                    size="tiny"
                                    open={open}
                                    trigger={
                                        <Button type='submit' primary fluid size='large' onClick={buy}>
                                            Buy
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
                                <div className="buy-bond-button">
                                    <Button color="red" onClick={cancel}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </>
                    :
                        <>
                            <div className="exchangelList">
                                <h2>Bond Market</h2>
                            </div>
                            {
                                bonds.dealsListed.length > 0 ?
                                    <div className="exchange-tab-scroll">
                                        <Table padded selectable inverted>
                                            <TableHeader className="header-sticky">
                                                <TableRow>
                                                    <TableHeaderCell>Issuer</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Bond Contract</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Deal ID</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Seller</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Symbol</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Qty</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Coupon</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Maturity</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Par Value</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Price</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'></TableHeaderCell>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {renderedBonds}
                                            </TableBody>
                                        </Table>
                                    </div>
                                :
                                    <div  className="no-approved-deal">
                                        There are no Bonds Listed on the Exchange at the moment
                                        <br></br>
                                        <br></br>
                                        Come back later
                                    </div>
                            }
                        </>
                }
            </div>
        </div>
    );
}

export default Exchange;