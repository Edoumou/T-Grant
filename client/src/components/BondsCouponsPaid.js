import React from "react";
import { useSelector } from "react-redux";
import "../users.css";
import "../manager.css";

function BondsCouponsPaid() {
    let bonds = useSelector(state => {
        return state.bond;
    });

    return (
        <>
            <br></br>
            <br></br>
            <br></br>
            <div className="issuerDealList">
                <strong>Coupon Payment</strong>
            </div>
        </>
    );
}

export default BondsCouponsPaid;