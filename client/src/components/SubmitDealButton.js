import React from "react";
import 'semantic-ui-css/semantic.min.css';
import { Button, Card, CardContent } from "semantic-ui-react";
import "../manager.css";

function SubmitDealButton() {
    const submitDeal = async () => {

    }

    return (
        <div className="list-card">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Fill out the Form for the Deal</strong>
                    <br></br>
                    <br></br>
                    <Button primary fluid onClick={submitDeal}>
                        Deal Form
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default SubmitDealButton;