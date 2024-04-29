import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Button, Card, CardContent, Grid, GridColumn, GridRow, Input, Modal } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../addresses/addr.json";
import { setBenchmark, setListOfIRS, setLoading } from "../store";

function SetBenchmark() {
    const connection = useSelector(state => {
        return state.connection;
    });
    
    const irs = useSelector(state => {
        return state.irs;
    });

    const dispatch = useDispatch();

    const caseSensitiveSearch = (tokenOptions, query) => {
        const re = new RegExp(_.escapeRegExp(query))
        return tokenOptions.filter((opt) => re.test(opt.text))
    }

    const [newBenchmark, setNewBenchmark] = useState('');
    const [loader, setLoader] = useState(true);
    const [open, setOpen] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    const updateBenchmark = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);

        await bankContract.methods.setBenchmark(Number(newBenchmark) * 100)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Updating the benchmark! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Transaction Completed! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        let _newBenchmark = await bankContract.methods.getBenchmark().call({ from: account });
        let listOfIRS = await bankContract.methods.getListOfIRS().call({ from: account });
        
        dispatch(setListOfIRS(listOfIRS));
        dispatch(setBenchmark(_newBenchmark));

        setNewBenchmark('');
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
                <div className="fund-head">
                    <h1>Benchmark: {irs.benchmark / 100}%</h1>
                    <br></br>
                    <h3><strong>Update the benchmark</strong></h3>
                </div>
                <div className="list-card">
                    <Card fluid className="account-check">
                        <CardContent textAlign="left">
                            <Input
                                fluid
                                size="large"
                                placeholder='New Benchmark'
                                value={newBenchmark}
                                onChange={e => setNewBenchmark(e.target.value)}
                            />
                            <br></br>
                            <br></br>
                            <div className="deal-button2">
                                <Modal
                                    size="tiny"
                                    open={open}
                                    trigger={
                                        <Button type='submit' color="orange" fluid size='large' onClick={updateBenchmark}>
                                            Update
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
                        </CardContent>
                    </Card>
                </div>





            </div>
        </div>
    );
}

export default SetBenchmark;