import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Button, Card, CardContent, Input, List, ListContent, ListDescription, ListIcon, ListItem } from "semantic-ui-react";
import "../manager.css";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";

function AccountCheck() {
    let [search, setSearch] = useState("");
    let [showForm, setShowForm] = useState(true);
    let [accountToCheck, setAccountToCheck] = useState([]);
    let [accountType, setAccountType] = useState(0);
    let [status, setStatus] = useState("");

    let dispatch = useDispatch();

    let issuersList = useSelector(state => {
        return state.issuer.listOfIssuers;
    });

    let investorsList = useSelector(state => {
        return state.investor.listOfInvestors;
    });

    const check = async () => {
        let issuer = issuersList.filter(user => {
            return user.name.toLowerCase() === search.toLowerCase() || user.walletAddress.toLowerCase() === search.toLowerCase();
        });

        let investor = investorsList.filter(user => {
            return user.name.toLowerCase() === search.toLowerCase() || user.walletAddress.toLowerCase() === search.toLowerCase();
        });

        if (issuer.length > 0) {
            setAccountToCheck(issuer);
            setShowForm(false);
            setAccountType(1);

            if(issuer[0].status === '1') setStatus("WAITING");
            if(issuer[0].status === '2') setStatus("APPROVED");
            if(issuer[0].status === '3') setStatus("REJECTED");
        }

        if (investor.length > 0) {
            setAccountToCheck(investor);
            setShowForm(false);
            setAccountType(2);

            if(investor[0].status === '1') setStatus("WAITING");
            if(investor[0].status === '2') setStatus("APPROVED");
            if(investor[0].status === '3') setStatus("REJECTED");
        }

        setSearch("");
    }

    const onCloseForm = async () => {
        setShowForm(true);
        setAccountType(0);
        setStatus("");
    }

    return (
        <div className="list-card">
            <Card fluid>
                <CardContent>
                    <strong>Check Account</strong>
                    <br></br>
                    <br></br>
                    {
                        status !== "" ?
                            <div style={{ color: "purple" }}>
                                <h4><strong>{status}</strong></h4>
                            </div>
                        :
                            <></>
                    }
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
                                        accountToCheck.length > 0 && accountType === 1 ?
                                            <div>
                                                <List divided relaxed>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Name</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {accountToCheck[0].name}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Country</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {accountToCheck[0].country}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Type</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {accountToCheck[0].issuerType}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Credit Rating</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {accountToCheck[0].creditRating}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Carbon Credit</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {Formate(accountToCheck[0].carbonCredit)}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Address</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {FormateAddress(accountToCheck[0].walletAddress)}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                </List>
                                                <br></br>
                                                <Button color="teal" fluid onClick={onCloseForm}>
                                                    Close
                                                </Button>
                                            </div>
                                        : accountToCheck.length > 0 && accountType === 2 ?
                                            <div>
                                                <List divided relaxed>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Name</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {accountToCheck[0].name}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Country</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {accountToCheck[0].country}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Type</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {accountToCheck[0].investorType}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListIcon name='check circle outline' size='large' color='green' verticalAlign='middle' />
                                                        <ListContent>
                                                            <div style={{ paddingBottom: 10 }}>
                                                                <h5><a href="#">Address</a></h5>
                                                            </div>
                                                            <ListDescription>
                                                                {FormateAddress(accountToCheck[0].walletAddress)}
                                                            </ListDescription>
                                                        </ListContent>  
                                                    </ListItem>
                                                </List>
                                                <br></br>
                                                <Button color="teal" fluid onClick={onCloseForm}>
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