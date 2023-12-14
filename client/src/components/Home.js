import React from "react";
import 'semantic-ui-css/semantic.min.css';
import { Image, Grid, GridColumn, GridRow, Segment } from "semantic-ui-react";
import IssuerImg from '../../src/img/issuer.png';
import InvestorImg from '../../src/img/investor.png';
import SmartContractImg from '../../src/img/smartContract.png';
import InterestsImg from '../../src/img/interests.png';
import WalletImg from '../../src/img/wallet.png';
import PlatformTokenImg from '../../src/img/platformToken.png';

function Home() {
    return (
        <div className="manager">
            <div className="home-desc">
                <div style={{ width: 80 }}>
                    <Image src={IssuerImg} floated="left" size='tiny' />
                </div>
                <div style={{ width: 80 }}>
                    <Image src={InvestorImg} size='tiny' />
                </div>
                <div style={{ width: 80 }}>
                    <Image src={SmartContractImg} floated="right" size='tiny' />
                </div>
            </div>
            <div className="home-process">
                <div style={{ width: 300, textAlign: 'center' }}>
                    <p>
                        Issue bonds tokens on blockchain with the financial bonds standard ERC-7092.
                        Tokenize your assets
                    </p>
                </div>
                <div style={{ width: 300, textAlign: 'center' }}>
                    <p>Invest in bonds in a secure and decentralized way, with lower minimum investment</p>
                </div>
                <div style={{ width: 300, textAlign: 'center' }}>
                    <p>Automate bonds management with the use of smart-contracts deployed on the blockchcain</p>
                </div>
            </div>

            <div className="home-desc">
                <div style={{ width: 80 }}>
                    <Image src={InterestsImg} floated="left" size='tiny' />
                </div>
                <div style={{ width: 80 }}>
                    <Image src={PlatformTokenImg} size='tiny' />
                </div>
                <div style={{ width: 80 }}>
                    <Image src={WalletImg} floated="right" size='tiny' />
                </div>
            </div>
            <div className="home-process">
                <div style={{ width: 300, textAlign: 'center' }}>
                    <p>
                        Earn fixed and floating interests by investing in fixed income instruments on our platform
                    </p>
                </div>
                <div style={{ width: 300, textAlign: 'center' }}>
                    <p>Earn our native tokens by investing on bonds through investment pools listed on our platform</p>
                </div>
                <div style={{ width: 300, textAlign: 'center' }}>
                    <p>Manage your tokens directly in your wallet without the need of custodies or other intermediaries</p>
                </div>
            </div>
        </div>
    );
}

export default Home;