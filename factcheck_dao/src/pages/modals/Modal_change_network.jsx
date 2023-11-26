import "./Modal.css";
const ModalChangeNetwork = (props) => {
    if (props.chain_id) {
        return (
            <>
                {props.chain_id !== 78950 ? ( // showFlagがtrueだったらModalを表示する
                    <div id="overlay" className="stars" style={{}}>
                        <div
                            id="modalContent"
                            style={{
                                color: "white",
                                position: "fixed",
                                top: "50%" /* 要素の上端を画面の中央に */,
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            {/* 文字を白くする */}
                            <h2>bloxbergに接続してください</h2>
                            <br />
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={() => {
                                    props.contracts.switch_network();
                                }}
                            >
                                Change Network
                            </button>
                        </div>
                    </div>
                ) : (
                    <></> // showFlagがfalseの場合はModalは表示しない
                )}
            </>
        );
    } else {
        return <></>;
    }
};

export default ModalChangeNetwork;
