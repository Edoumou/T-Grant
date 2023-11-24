import React from "react";
import 'semantic-ui-css/semantic.min.css';
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardContent, Icon } from "semantic-ui-react";
import { setShowForm } from "../store";
import "../manager.css";

function SubmitDealButton() {
    const dispatch = useDispatch();

    const issuer = useSelector(state => {
        return state.issuer;
    });

    const submitDeal = async () => {
        dispatch(setShowForm(true));
    }

    return (
        <div className="list-card">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Submit a Deal</strong>
                    <br></br>
                    <br></br>
                    {
                        issuer.showForm ?
                            <>
                                All fields are required
                                <span style={{ marginLeft: 10 }}><Icon name="hand point right" color="green" size="large" /></span> 
                            </>
                        :
                            <Button primary fluid onClick={submitDeal}>
                                Deal Form
                            </Button>
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default SubmitDealButton;