import {React} from "react";
import {useParams} from "react-router-dom";
// import { Form, InputGroup, Button } from "react-bootstrap";
import ViewRequest from "../../../components/view_request";
import ReceiveForm from "./components/receive_form";

function ReceiveFactcheck({contracts, reloadKey}) {
    const {requestId} = useParams();

    return (
        <div>
            <ViewRequest contracts={contracts} reloadKey={reloadKey} requestId={requestId} />
            <ReceiveForm contracts={contracts} reloadKey={reloadKey} requestId={requestId} />
        </div>
    );
}

export default ReceiveFactcheck;
