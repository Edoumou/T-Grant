import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationInstance from "../../src/contracts/artifacts/contracts/Registry/IdentityRegistry.sol/IdentityRegistry.json";
import AuthenticationHash from '../utils/AuthenticationHash';
import "../users.css";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setSignedUp } from "../store";

function Register() {
    const [alertMessage, setAlertMessage] = useState('');
    const [username, setUsername] = useState('');
    const [digicode, setDigicode] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');

    const dispatch = useDispatch();

    const onSignUp = async () => {
        //this.setState({ signedUp: false });
        let connection = await web3Connection();
        let web3 = connection.web3;
        let account = connection.account;
        let contract = await getContract(web3, AuthenticationInstance);

        if (username !== '' && password !== '' && digicode !== '') {
            let usernameToUse = username.trim();
            let passwordToUse = password.trim();
            let digicodeToUse = digicode.trim();

            //===
            if (passwordToUse.length < 8) {
                setAlertMessage("at least 8 characters for password");
                setStatus('failed');
                setPassword('');
                setDigicode('');

                return;
            } else {

            }
            
            if (digicodeToUse.length !== 6) {
                setAlertMessage("6 digit required for digicode");
                setStatus('failed');
                setDigicode('');

                return
            } else {
                let userAddress = await contract.methods.getUserAddress()
                    .call({ from: account });

                if (userAddress !== '0x0000000000000000000000000000000000000000') {
                    setAlertMessage("this account already exists");
                    setStatus('failed');
                    setPassword('');
                    setDigicode('');
                    setUsername('');

                    return;
                } else {
                    let hash = await AuthenticationHash(
                        usernameToUse, account, passwordToUse, digicodeToUse, web3
                    );

                    await contract.methods.register(hash).send({ from: account });

                    setUsername('');
                    setPassword('');
                    setDigicode('');
                    setStatus('success');
                    setAlertMessage("Signup successful");
                    //dispatch(setSignedUp(true));

                    return;
                }
            }
        }

    }

    return (
        <div>
            <div className="sign-up">
                Register to Securities Tokenization
                <div className='signup-form'>
                    <Card color="green" fluid centered>
                        <Card.Content>
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
                                        value={username}
                                        autoComplete="username"
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Phone Number'
                                        value={username}
                                        autoComplete="username"
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Email Address'
                                        value={username}
                                        autoComplete="username"
                                        onChange={e => setUsername(e.target.value)}
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
                                    <Button type='submit' primary fluid size='large' onClick={onSignUp}>
                                        Register
                                    </Button>
                                </Form.Field>
                            </Form>
                        </Card.Content>
                    </Card>
                    <div className="signin-onUp">
                        Already registered? <Link to='/sign-in'>Connect</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;