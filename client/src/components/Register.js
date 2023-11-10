import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, Message, Header, Modal, Loader, Dimmer } from 'semantic-ui-react';
import IdentityRegistrationJSON from "../../src/contracts/artifacts/contracts/Registry/IdentityRegistry.sol/IdentityRegistry.json";
import RegistrationHash from "../utils/RegistrationHash";
import AuthenticationHash from "../utils/AuthenticationHash";
import "../users.css";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setIsVerified, setLoading, setSignedUp } from "../store";
import Addresses from "../../src/addresses/addr.json";

function Register() {
    const [alertMessage, setAlertMessage] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [digicode, setDigicode] = useState('');
    const [status, setStatus] = useState('');
    const [txHash, setTxHash] = useState('');
    const [loader, setLoader] = useState(true);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();

    const loading = useSelector(state => {
        return state.connection.loading;
    });

    const onRegister = async () => {
        let connection = await web3Connection();
        let web3 = connection.web3;
        let account = connection.account;
        let contract = await getContract(web3, IdentityRegistrationJSON, Addresses.RegistryContract);

        if (fullname !== '' && phone !== '' && email !== '' && digicode !== '') {
            let fullNameToUse = fullname.trim();
            let phoneToUse = phone.trim();
            let emailToUse = email.trim();
            let digicodeToUse = digicode.trim();

            //===
            if (digicodeToUse.length !== 6) {
                setAlertMessage("6 digit required for digicode");
                setStatus('failed');
                setDigicode('');

                return
            } else {
                let isVerified = await contract.methods.isVerified(account)
                    .call({ from: account });

                if (isVerified) {
                    dispatch(setIsVerified(true));

                    setAlertMessage("this account is already registered");
                    setStatus('failed');
                    setFullname('');
                    setPhone('');
                    setEmail('');
                    setDigicode('');

                    return;
                } else {
                    let authHash = await AuthenticationHash(
                        account, digicodeToUse, web3
                    );

                    let identityID = await RegistrationHash(
                        account,
                        fullNameToUse,
                        phoneToUse,
                        emailToUse,
                        web3
                    );

                    await contract.methods.register(identityID, authHash)
                        .send({ from: account })
                        .on('transactionHash', hash => {
                            setLoadingMessage('Transaction in Process! ⌛️');
                            setExplorerLink(`https://explorer.testnet-1.topos.technology/subnet/0xe93335e1ec5c2174dfcde38dbdcc6fd39d741a74521e0e01155c49fa77f743ae/transaction/${hash}`);
                            setTxHash(hash);
                            dispatch(setLoading(true));
                            setFullname('');
                            setPhone('');
                            setEmail('');
                            setDigicode('');
                            dispatch(setSignedUp(true));
                        })
                        .on('receipt', receipt => {
                            setLoadingMessage('Transaction Completed! ✅');
                            setLoader(false);
                            setStatus('success');
                            setAlertMessage("Signup successful");
                            dispatch(setLoading(false));
                        });

                    setFullname('');
                    setPhone('');
                    setEmail('');
                    setDigicode('');

                    return;
                }
            }
        }
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return (
        <div className="sign-up">
            Register to Securities Tokenization

            <div className='signup-form'>
                <Form size='large'>
                    {
                        alertMessage !== '' && status === 'failed' ?
                            <Message negative>
                                {alertMessage}
                            </Message>
                        :
                            alertMessage !== '' && status === 'success' ?
                            <Message positive>
                                {alertMessage}
                            </Message>
                        :
                            <></>
                    }
                    <Form.Field>
                        <input
                            required
                            
                            type='text'
                            placeholder='Full Name'
                            value={fullname}
                            autoComplete="username"
                            onChange={e => setFullname(e.target.value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <input
                            required
                            type='text'
                            placeholder='Phone Number'
                            value={phone}
                            autoComplete="username"
                            onChange={e => setPhone(e.target.value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <input
                            required
                            type='text'
                            placeholder='Email Address'
                            value={email}
                            autoComplete="username"
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Field>
                    <br></br>
                    <br></br>
                    <Form.Field>
                        <input
                            required
                            type='text'
                            placeholder='6 digit code for connection'
                            value={digicode}
                            autoComplete="digicode"
                            onChange={e => setDigicode(e.target.value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Modal
                            size="tiny"
                            open={open}
                            trigger={
                                <Button type='submit' primary fluid size='large' onClick={onRegister}>
                                    Register
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
                    </Form.Field>
                </Form>
                <div className="signin-onUp">
                    Already registered? <Link to='/connect'>Connect</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;