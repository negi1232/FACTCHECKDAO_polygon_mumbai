import React, {useEffect, useState} from "react";
import ParameterInfo from "./components/parameterInfo";
import ActiveElection from "./components/active_election";
import {Container, Accordion} from "react-bootstrap"; // Import Container component from React Bootstrap
import "./home.css";

function Parameters({contracts, reloadKey}) {
    const [parameters, setParameters] = useState([]);
    const [activeElection, setActiveElection] = useState(null);
    const [daoSetting, setDaoSetting] = useState([0, 0, 0, 0]);

    useEffect(() => {
        async function getContract() {
            setParameters(await contracts.get_parameters());
            setActiveElection(await contracts.getActive_election());
            setDaoSetting(await contracts.getElection_setting());
            // console.log(await contracts.getElection_setting());
        }
        getContract();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

    if (parameters) {
        return (
            <Container>
                <div className="active_election">
                    <ActiveElection contracts={contracts} active_election={activeElection} vote_amount={daoSetting[1]} />
                </div>

                <Accordion>
                    {parameters.map((parameter, index) => (
                        <ParameterInfo contracts={contracts} key={index} id={index + 1} name={parameter.name_jp} content={parameter.description_jp} value={parseInt(parameter.value)} decimals={parseInt(parameter.decimals)} unit={parameter.unit_jp} min_time={daoSetting[2]} max_time={daoSetting[3]} election_start_amount={daoSetting[0]} />
                    ))}
                </Accordion>
            </Container>
        );
    } else {
        return <div></div>;
    }
}

export default Parameters;
