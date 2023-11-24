import React from "react";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, GridRow } from "semantic-ui-react";

function Home() {
    return (
        <div className="container">
            <Grid columns={2}>
                <GridRow>
                    <GridColumn width={8}>
                        <div className="text-card">
                            <div className="text-card-header">
                                Issue security tokens
                            </div>
                            <p className="text-card-p">
                                SecurTok helps companies issue security tokens on the Blockchain
                                through a set of smart contracts created with stadards like ERC-7092.
                                <br></br>
                                <br></br>
                                Develop and tests smart contracts with tools like Truffle, Hardhat, web3.js,
                                ganache, etc...
                                <br></br>
                                <br></br>
                                Deployment on testnet to test contracts before they go live. Deployment on
                                mainnet once contracts have been tested and audited.
                            </p>
                        </div>
                    </GridColumn>
                    <GridColumn width={8}>
                        <div className="text-card">
                            <div className="text-card-header">
                                Manage security tokens
                            </div>
                            <p className="text-card-p">
                                SecurTok helps companies manage their security tokens on the Blockchain
                                by providing a set of tools and services necessary to level up their
                                needs.
                                <br></br>
                                <br></br>
                                Develop and tests smart contracts with tools like Truffle, Hardhat, web3.js,
                                ganache, etc...
                                <br></br>
                                <br></br>
                                Deployment on testnet to test contracts before they go live. Deployment on
                                mainnet once contracts have been tested and audited.
                            </p>
                        </div>
                    </GridColumn>
                </GridRow>
            </Grid>
        </div>
    );
}

export default Home;