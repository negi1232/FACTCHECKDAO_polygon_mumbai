import "./home.css";
function TransactionForm({ contracts, isMobile, text, url }) {
    if (isMobile) {
        return (
            <div id="popup-container">
                <div id="popup" class="hidden">
                    <p id="popup-text">aaaaa</p>
                </div>
            </div>
        );
    } else {
        return (
            <div id="popup-container">
                <div id="popup" class="hidden">
                    <p id="popup-text">aaaaa</p>
                </div>
            </div>
        );
    }
}

export default TransactionForm;
