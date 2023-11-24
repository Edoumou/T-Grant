import React from "react";
import 'semantic-ui-css/semantic.min.css';
import { Card, CardContent, List, ListContent, ListDescription, ListIcon, ListItem } from "semantic-ui-react";

function InvestorDealSideBar() {
    return (
        <div className="list-card">
            <Card fluid className="account-check">
                <CardContent textAlign="left">
                    <h3><strong>Important for Deals</strong></h3>
                    <List divided relaxed>
                        <ListItem>
                            <ListIcon name='file' size='large' color='orange' verticalAlign='middle' />
                            <ListContent>
                                <div style={{ paddingBottom: 10, textTransform: "uppercase" }}>
                                    <h5><a href="/#">Deal Prospectus</a></h5>
                                </div>
                                <ListDescription className="list-description">
                                    <div className="list-description">
                                        A prospectus is a document that is published by, or on behalf of,
                                        the selling company in an acquisition, a private capital placement
                                        or an initial public offering. It contains information about the
                                        company's financial status, business plan, recent performance,
                                        contingent obligations, and other operating and financial matters
                                    </div>
                                </ListDescription>
                            </ListContent>  
                        </ListItem>
                        <ListItem>
                            <ListIcon name='cube' size='large' color='teal' verticalAlign='middle' />
                            <ListContent>
                                <div style={{ paddingBottom: 10, textTransform: "uppercase" }}>
                                    <h5><a href="/#">Issue Volume</a></h5>
                                </div>
                                <ListDescription>
                                    <div className="list-description">
                                        The issue volume of a bond offering is the number of bonds issued multiplied
                                        by the denomination (price of one unit of bond)
                                    </div>
                                </ListDescription>
                            </ListContent>  
                        </ListItem>
                        <ListItem>
                            <ListIcon name='percent' size='large' color='orange' verticalAlign='middle' />
                            <ListContent>
                                <div style={{ paddingBottom: 10, textTransform: "uppercase" }}>
                                    <h5><a href="/#">Coupon Rate</a></h5>
                                </div>
                                <ListDescription>
                                    <div className="list-description">
                                        Percentage that describes how much is paid by a bond security to the
                                        owner of that security during the duration of that bond
                                    </div>
                                </ListDescription>
                            </ListContent>  
                        </ListItem>
                        <ListItem>
                            <ListIcon name='calendar alternate' size='large' color='purple' verticalAlign='middle' />
                            <ListContent>
                                <div style={{ paddingBottom: 10, textTransform: "uppercase" }}>
                                    <h5><a href="/#">Coupon Frequency</a></h5>
                                </div>
                                <ListDescription>
                                    <div className="list-description">
                                        The coupon frequency means how regularly an issuer pays the coupon to bondholder
                                    </div>
                                </ListDescription>
                            </ListContent>  
                        </ListItem>
                        <ListItem>
                            <ListIcon name='money bill alternate outline' size='large' color='green' verticalAlign='middle' />
                            <ListContent>
                                <div style={{ paddingBottom: 10, textTransform: "uppercase" }}>
                                    <h5><a href="/#">Currency</a></h5>
                                </div>
                                <ListDescription>
                                    <div className="list-description">
                                        The currency the bond is sold for in the Primary Market, and redeemed at maturity.
                                        In the case the currency of coupons is not defined, this should also represents the
                                        currency for coupon payment
                                    </div>
                                </ListDescription>
                            </ListContent>  
                        </ListItem>
                        <ListItem>
                            <ListIcon name='calendar alternate' size='large' color='orange' verticalAlign='middle' />
                            <ListContent>
                                <div style={{ paddingBottom: 10, textTransform: "uppercase" }}>
                                    <h5><a href="/#">Maturity Date</a></h5>
                                </div>
                                <ListDescription>
                                    <div className="list-description">
                                        The maturity date of a bond refers to the date when the principal amount of an investment
                                        becomes due and is repaid to the investor or holder
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

export default InvestorDealSideBar;