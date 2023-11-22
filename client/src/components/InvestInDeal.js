import React from "react";
import { connect, useSelector } from "react-redux";

function SelectDeal() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const deals = connection.deals.filter(
        deal => deal.status === '2'
    );

    return (
        <div>
            Deals
        </div>
    );
}

export default SelectDeal;