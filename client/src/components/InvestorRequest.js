import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Message } from 'semantic-ui-react';
import AuthenticationJSON from "../../src/contracts/artifacts/contracts/Auth/Authentication.sol/Authentication.json";
import AuthValidation from "../utils/AuthValidation";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setLoggedIn, setAccount, setActiveItem } from "../store";
import Addresses from "../../src/addresses/addr.json";

function InvestorRequest() {
    const [alertMessage, setAlertMessage] = useState('');
    const [digicode, setDigicode] = useState('');
    const [status, setStatus] = useState('');

    const dispatch = useDispatch();

    

    return (
        <div className="sign-up">
            Investor Request
        </div>
    );
}

export default InvestorRequest;