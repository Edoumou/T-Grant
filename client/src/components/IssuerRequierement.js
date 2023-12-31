import React from "react";
import 'semantic-ui-css/semantic.min.css';
import { Card, CardContent, List, ListContent, ListDescription, ListIcon, ListItem } from "semantic-ui-react";

function IssuerRequierement() {
    return (
        <div className="list-card">
            <Card fluid className="account-check">
                <CardContent textAlign="left">
                    <h3><strong>Check carefully</strong></h3>
                    <List divided relaxed>
                        <ListItem>
                            <ListIcon name='file' size='large' color='orange' verticalAlign='middle' />
                            <ListContent>
                                <div style={{ paddingBottom: 10, textTransform: "uppercase" }}>
                                    <h5><a href="/#">Issuer Document</a></h5>
                                </div>
                                <ListDescription className="list-description">
                                    <div className="list-description">
                                        Make sure that the issuer has submitted their document.
                                        This document is used to evaluate if an entitity can
                                        become an issuer on the platform
                                    </div>
                                </ListDescription>
                            </ListContent>  
                        </ListItem>
                        <ListItem>
                            <ListIcon name='certificate' size='large' color='blue' verticalAlign='middle' />
                            <ListContent>
                                <div style={{ paddingBottom: 10, textTransform: "uppercase" }}>
                                    <h5><a href="/#">Credit Rating</a></h5>
                                </div>
                                <ListDescription>
                                    <div className="list-description">
                                        A credit rating is an evaluation of the credit risk of a prospective debtor
                                        (an individual, a business, company or a government), predicting their
                                        ability to pay back the debt, and an implicit forecast of the likelihood
                                        of the debtor defaulting
                                    </div>
                                </ListDescription>
                            </ListContent>  
                        </ListItem>
                        <ListItem>
                            <ListIcon name='ticket' size='large' color='green' verticalAlign='middle' />
                            <ListContent>
                                <div style={{ paddingBottom: 10, textTransform: "uppercase" }}>
                                    <h5><a href="/#">Carbon Credit</a></h5>
                                </div>
                                <ListDescription>
                                    <div className="list-description">
                                        Permit that allows the owner to emit a certain amount of carbon dioxide or other greenhouse gases
                                    </div>
                                </ListDescription>
                            </ListContent>  
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </div>
    );
}

export default IssuerRequierement;