import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, Message } from 'semantic-ui-react';
import IdentityRegistrationJSON from "../../src/contracts/artifacts/contracts/Registry/IdentityRegistry.sol/IdentityRegistry.json";
import RegistrationHash from "../utils/RegistrationHash";
import AuthenticationHash from "../utils/AuthenticationHash";
import "../users.css";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setIsVerified, setSignedUp } from "../store";
import Addresses from "../../src/addresses/addr.json";

function Register() {
    const [alertMessage, setAlertMessage] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [digicode, setDigicode] = useState('');
    const [status, setStatus] = useState('');

    const dispatch = useDispatch();

    const onSignUp = async () => {
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

                    await contract.methods.register(identityID, authHash).send({ from: account });

                    setFullname('');
                    setPhone('');
                    setEmail('');
                    setDigicode('');
                    setStatus('success');
                    setAlertMessage("Signup successful");
                    dispatch(setSignedUp(true));

                    return;
                }
            }
        }
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
                        <Button type='submit' primary fluid size='large' onClick={onSignUp}>
                            Register
                        </Button>
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