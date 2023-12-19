import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardContent, Modal, ModalContent, ModalActions } from "semantic-ui-react";
import CouponPaymentJSON from "../contracts/artifacts/contracts/coupon/CouponPayment.sol/CouponPayment.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../addresses/addr.json";
import "../users.css";
import "../manager.css";
import { setCouponsPaid, setLoading } from "../store";
import FormateAddress from "../utils/FormateAddress";

function PayInterests() {
    const [loader, setLoader] = useState(true);
    const [open, setOpen] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    let bonds = useSelector(state => {
        return state.bond;
    });

    let dispatch = useDispatch();

    const payCoupons = async () => {
        let { web3, account } = await web3Connection();
        let couponPayment = await getContract(web3, CouponPaymentJSON, Addresses.CouponPaymentContract);

        await couponPayment.methods.payInterestEveryMinutes(bonds.selectedActiveBond.bondContract)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Transaction in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Transaction Completed! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        let listOfInterestsPaid = await couponPayment.methods.getListOfInterestsPaid(
            bonds.selectedActiveBond.bondContract
        ).call({ from: account });

        dispatch(setCouponsPaid(listOfInterestsPaid));
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return(
        <div className="list-card">
            <br></br>
            <br></br>
            <Card fluid className="account-check">
                <CardContent textAlign="left">
                    <Modal
                        size="tiny"
                        open={open}
                        trigger={
                            <Button type='submit' color="teal" fluid size='large' onClick={payCoupons}>
                                Pay Coupons
                            </Button>
                        }
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                    >
                        <ModalContent>
                            <div style={{ textAlign: 'center' }}>
                                <h3>{loadingMessage}</h3>
                                {
                                    loader ?
                                        <Button inverted basic loading size="massive">Transferring Coupons to Investors</Button>
                                    :
                                        <p style={{ color: 'green' }}><strong>Coupons Transferred successfully</strong></p>
                                }
                            </div>
                        </ModalContent>
                        <ModalActions>
                            <Button basic floated="left" onClick={goToExplorer}>
                                <strong>Check on Topos Explorer</strong>
                            </Button>
                            <Button color='black' onClick={() => setOpen(false)}>
                                Go to Dashboard
                            </Button>
                        </ModalActions>
                    </Modal>
                </CardContent>
            </Card>
            <br></br>
            <br></br>
            <h4 style={{ color: "white" }}>Bond Contract</h4>
            <a
                href={`https://topos.blockscout.testnet-1.topos.technology/address/${bonds.selectedActiveBond.bondContract}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {FormateAddress(bonds.selectedActiveBond.bondContract)}
            </a>
        </div>
    );
}

export default PayInterests;