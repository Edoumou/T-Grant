import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ManagerRequests() {
    let issuers = useSelector(state => {
        return state.issuer.listOfIssuers;
    });

    return (
        <div className="container">
            Manager Requests:
        </div>
    );
}

export default ManagerRequests;