import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, Message } from 'semantic-ui-react';
import AuthenticationJSON from "../../src/contracts/artifacts/contracts/Auth/Authentication.sol/Authentication.json";
import AuthValidation from "../utils/AuthValidation";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setLoggedIn, setAccount, setActiveItem } from "../store";
import Addresses from "../../src/addresses/addr.json";

function Connect() {
    const [alertMessage, setAlertMessage] = useState('');
    const [digicode, setDigicode] = useState('');
    const [status, setStatus] = useState('');

    const dispatch = useDispatch();

    const onConnect = async () => {
        let connection = await web3Connection();
        let web3 = connection.web3;
        let account = connection.account;
        let contract = await getContract(web3, AuthenticationJSON, Addresses.AuthenticationContract);

        if (digicode !== '') {
            let digicodeToUse = digicode.trim();
            
            if (digicodeToUse.length !== 6) {
                setAlertMessage("6 digit required for digicode");
                setStatus('failed');
                setDigicode('');

                return
            } else {
                let userAddress = await contract.methods.getUserAddress()
                    .call({ from: account });

                if (userAddress === '0x0000000000000000000000000000000000000000') {
                    setAlertMessage("Account does not exist");
                    setStatus('failed');
                    setDigicode('');

                    return;
                } else {
                    let validated = await
                        AuthValidation(
                            account,
                            digicodeToUse,
                            web3,
                            contract
                        );

                    if (!validated) {
                        setAlertMessage("Incorrect digicode");
                        setStatus('failed');
                        setDigicode('');

                        return
                    } else {
                        setAlertMessage("Connection Successful");
                        setStatus('success');
                        setDigicode('');
                        
                        dispatch(setAccount(account));
                        dispatch(setLoggedIn(true));

                        return;
                    }
                }
            }
        }

        setDigicode('');
    }

    return (
        <div className="sign-up">
            Connect to your Account
            <div className='signup-form'>
                <Form size='large'>
                    {
                        alertMessage !== '' && status === 'failed' ?
                            <Message negative>
                                {alertMessage}
                            </Message> :
                                alertMessage !== '' && status === 'success' ?
                                <Message positive>
                                    {alertMessage}
                                </Message> :
                                <></>
                    }
                    <Form.Field required>
                        <input
                            type='password'
                            placeholder='6 digit code'
                            value={digicode}
                            autoComplete="digicode"
                            onChange={e => setDigicode(e.target.value )}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Button type='submit' primary fluid size='large' onClick={onConnect}>
                            Connect
                        </Button>
                    </Form.Field>
                </Form>
                
                <div className="signin-onUp">
                    Don't have an account? <Button compact size="large" inverted onClick={() => dispatch(setActiveItem('register'))}><Link to='/register'>Register</Link></Button>
                </div>
            </div>
        </div>
    );
}

export default Connect;