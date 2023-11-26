import React from "react";
import {Accordion, Button} from "react-bootstrap";
import ElectionForm from "./election_form";

function ParameterInfo({contracts, id, name, content, expanded, value, decimals, unit, max_time, min_time, election_start_amount}) {
    return (
        <Accordion.Item eventKey={id}>
            <Accordion.Header>{name}</Accordion.Header>
            <Accordion.Body>
                {content}
                <ElectionForm contracts={contracts} parameters_index={id} name={name} value={value} decimals={decimals} unit={unit} max_time={max_time} min_time={min_time} election_start_amount={election_start_amount} />
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default ParameterInfo;
