import React, { useState } from "react";
import "../users.css";
import "../manager.css";
import { useSelector } from "react-redux";
import { Button, Dropdown, Menu, Modal, ModalActions, ModalContent } from "semantic-ui-react";

function MintTokens() {
    const [tokenAddress, setTokenAddress] = useState('');
    const [loader, setLoader] = useState(true);
    const [open, setOpen] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    const connection = useSelector(state => {
        return state.connection;
    });

    const tokenOptions = [
        { key: 1, text: connection.tokenSymbols[0], value: connection.tokenAddresses[0] },
        { key: 2, text: connection.tokenSymbols[1], value: connection.tokenAddresses[1] },
        { key: 3, text: connection.tokenSymbols[2], value: connection.tokenAddresses[2] },
        { key: 4, text: connection.tokenSymbols[3], value: connection.tokenAddresses[3] },
        { key: 5, text: connection.tokenSymbols[4], value: connection.tokenAddresses[4] },
        { key: 6, text: connection.tokenSymbols[5], value: connection.tokenAddresses[5] },
        { key: 7, text: connection.tokenSymbols[6], value: connection.tokenAddresses[6] }
    ];

    const mint = async () => {

    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return (
        <div className="mint-tokens">
            <h1>Mint Tokens</h1>
            <br></br>
            <div className="mint-token-form">
                <Dropdown
                    placeholder="Select Token"
                    options={tokenOptions}
                    value={tokenAddress}
                    onChange={(e, data) => setTokenAddress(data.value)}
                />
                <br></br>
                <br></br>
                <br></br>
                <Modal
                    size="tiny"
                    open={open}
                    trigger={
                        <Button type='submit' color="orange" fluid size='large' onClick={mint}>
                            Mint
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
    );
}

export default MintTokens;