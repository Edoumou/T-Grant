import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Button, Card, CardContent, Input, List, ListContent, ListDescription, ListIcon, ListItem } from "semantic-ui-react";
import "../manager.css";

function AccountCheck() {
    let [search, setSearch] = useState("");
    let [showForm, setShowForm] = useState(true);
    let [accountToCheck, setAccountToCheck] = useState([]);

    let dispatch = useDispatch();

    let issuersList = useSelector(state => {
        return state.issuer.listOfIssuers;
    });

    let investorsList = useSelector(state => {
        return state.investor.listOfInvestors;
    });

    const check = async () => {
        let issuer = issuersList.filter(user => {
            return user.name === search || user.walletAddress === search;
        });

        let investor = investorsList.filter(user => {
            return user.name === search || user.walletAddress === search;
        });

        if (issuer.length > 0) {
            setAccountToCheck(issuer);
            setShowForm(false)
        }

        if (investor.length > 0) {
            setAccountToCheck(investor);
            setShowForm(false)
        }

        setSearch("");
    }

    return (
        <div className="list-card">
            <Card fluid>
                <CardContent>
                    <strong>Check Account Status</strong>
                    <br></br>
                    <br></br>
                    {
                        showForm ?
                            <>
                                <Input
                                    fluid
                                    size="large"
                                    placeholder="Name or Account Address"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <br></br>
                                <Button primary fluid onClick={check}>
                                    Check
                                </Button>
                            </>
                        :
                            <>
                                <div>
                                    {
                                        accountToCheck.length > 0 ?
                                            <div>
                                                {accountToCheck[0].name}
                                                <br></br>
                                                <br></br>
                                                <Button primary fluid onClick={() => setShowForm(true)}>
                                                    Close
                                                </Button>
                                            </div>
                                        :
                                        <></>
                                    }
                                </div>
                            </>
                    }
                </CardContent> 
            </Card>
        </div>
    );
}

export default AccountCheck;