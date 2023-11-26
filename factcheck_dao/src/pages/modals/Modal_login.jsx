import "./Modal.css";
const ModalLogin = (props) => {
    return (
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
                <h2>ウォレットを接続して下さい</h2>
                <br />
                <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => {
                        props.contracts.connect_request();
                    }}
                >
                    connect MetaMask
                </button>
            </div>
        </div>
    );
};

export default ModalLogin;
