import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Message, Grid, GridRow, GridColumn, Menu, Dropdown, Input } from 'semantic-ui-react';
import AuthenticationJSON from "../../src/contracts/artifacts/contracts/Auth/Authentication.sol/Authentication.json";
import AuthValidation from "../utils/AuthValidation";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setLoggedIn, setAccount, setActiveItem } from "../store";
import Addresses from "../../src/addresses/addr.json";

function IssuerRequest() {
    const [alertMessage, setAlertMessage] = useState('');
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');

    const dispatch = useDispatch();

    const options = [
        { key: 1, text: 'GOV', value: 'GOV' },
        { key: 2, text: 'MUNI', value: 'MUNI' },
        { key: 3, text: 'CORP', value: 'CORP' },
        { key: 4, text: 'CEX', value: 'CEX' },
        { key: 5, text: 'DEX', value: 'DEX' },
        { key: 6, text: 'OTHER', value: 'OTHER' },
    ];

    const request = async () => {

    }

    return (
        <div className="deal-main">
            <div className="deal-head">
                Become an Issuer
            </div>
            <div className="deal-form">
                <Grid stackable columns={3}>
                    <GridRow>
                        <GridColumn>
                            <Input
                                fluid
                                size="mini"
                                placeholder='Document URL'
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </GridColumn>
                        <GridColumn>
                            <Input
                                fluid
                                size="mini"
                                placeholder='issuer account address'
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </GridColumn>
                        <GridColumn>
                            <Input
                                fluid
                                size="mini"
                                placeholder='issue volume'
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </GridColumn>
                    </GridRow>
                    <GridRow>
                        <GridColumn>
                            <Input
                                fluid
                                size="mini"
                                placeholder='denomination'
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </GridColumn>
                        <GridColumn>
                            <Input
                                fluid
                                size="mini"
                                placeholder='coupon rate'
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </GridColumn>
                        <GridColumn>
                            <Input
                                fluid
                                size="mini"
                                placeholder='coupon frequency'
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </GridColumn>
                    </GridRow>
                    <GridRow>
                        <GridColumn>
                            <Menu>
                                <Dropdown
                                    placeholder="principal token address"
                                    options={options}
                                    value={url}
                                    onChange={(e, data) => setUrl(e.target.value)}
                                />
                            </Menu>
                        </GridColumn>
                        <GridColumn>
                            <Menu>
                                <Dropdown
                                    placeholder="coupon type"
                                    options={options}
                                    value={url}
                                    onChange={(e, data) => setUrl(data.value)}
                                />
                            </Menu>
                        </GridColumn>
                        <GridColumn>
                            <Input
                                fluid
                                type="date"
                                size="mini"
                                placeholder='maturity date'
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
            <br></br>
            <br></br>
            <div className="deal-button">
            <Button
                    fluid
                    size='large'
                    color='vk'
                    content="Submit"
                    onClick={request}
                /> 
            </div>   
        </div>
    );
}

export default IssuerRequest;