import React, {useEffect, useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Container} from "react-bootstrap";
import {isMobile} from "react-device-detect";

import Contract from "./contract/contracts";
import {polygonMumbai} from "viem/chains";
import ModalChangeNetwork from "./pages/modals/Modal_change_network";
import ModalLogin from "./pages/modals/Modal_login";
import Wait_Modal from "./pages/modals/wait_Modal";
import CustomNavbar from "./pages/navbar/navbar";
import Dao from "./pages/dao/home";
import RequestFactcheck from "./pages/factcheck/request/home";
import ReceiveFactcheck from "./pages/factcheck/receive/home";
import RequestFactcheckListReceive from "./pages/factcheck/receive_list/home";
import RequestFactcheckList from "./pages/factcheck/list/home";
import BrowseFactcheck from "./pages/factcheck/browse/home";
import UserPage from "./pages/user_page/home";

function App() {
    const [receipt, setReceipt] = useState(null);
    const [isConnect, setConnect] = useState(false);
    const [networkId, setNetworkId] = useState(0);
    const [balance, setBalance] = useState(null);
    const [address, setAddress] = useState(null);
    const [isShow, setShow] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    function reloadPage() {
        setReloadKey((prevKey) => prevKey + 1);
    }

    const contracts = new Contract(receipt, setReceipt, reloadPage, setShow);

    async function getContract() {
        //... 非同期処理のコード ...
        setConnect(await contracts.is_connect());
        setNetworkId(await contracts.check_network_id());
    }

    async function getUser() {
        //... 非同期処理のコード ...
        setBalance(await contracts.get_token_balance());
        setAddress(await contracts.get_address());
    }

    useEffect(() => {
        if (isConnect && networkId === polygonMumbai.id) {
            getUser();
        } else {
            getContract();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnect, networkId, reloadKey]);

    if (networkId !== polygonMumbai.id) {
        return <ModalChangeNetwork chain_id={networkId} contracts={contracts} />;
    } else if (!isConnect) {
        return <ModalLogin contracts={contracts} />;
    } else if (contracts) {
        return (
            <div className="App">
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <header className="App-header">
                        <CustomNavbar contracts={contracts} isMobile={isMobile} balance={balance} address={address} />
                    </header>
                    <Container>
                        <Routes>
                            <Route path="/dao" element={<Dao contracts={contracts} reloadKey={reloadKey} />} />
                            <Route path="/factcheck/request" element={<RequestFactcheck contracts={contracts} reloadKey={reloadKey} />} />
                            <Route path="/factcheck/receive/:requestId" element={<ReceiveFactcheck contracts={contracts} reloadKey={reloadKey} />} />
                            <Route path="/factcheck/receive_list" element={<RequestFactcheckListReceive contracts={contracts} reloadKey={reloadKey} />} />
                            <Route path="/factcheck/list" element={<RequestFactcheckList contracts={contracts} reloadKey={reloadKey} />} />
                            <Route path="/factcheck/browse/:requestId" element={<BrowseFactcheck contracts={contracts} reloadKey={reloadKey} />} />
                            <Route path="/user/:address" element={<UserPage contracts={contracts} reloadKey={reloadKey} />} />
                        </Routes>
                    </Container>
                    <Wait_Modal is_show={isShow} receipt={receipt} />
                    <footer className="App-footer">
                        <div style={{marginBottom: "200px"}}></div>
                    </footer>
                </BrowserRouter>
            </div>
        );
    } else {
        return (
            <div className="App">
                <header className="App-header">
                    <p>loading...</p>
                </header>
            </div>
        );
    }
}

export default App;
