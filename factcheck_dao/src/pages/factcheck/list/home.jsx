import {React, useState, useEffect} from "react";
// import generateFactCheckData from "./dummy";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Form} from "react-bootstrap";
import "./home.css";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const Pagination = ({pages, currentPage, setCurrentPage, history}) => {
    const addQueryParam = (pageNumber) => {
        // ページ番号が有効な範囲内にあることを確認
        if (pageNumber >= 0 && pageNumber <= pages) {
            const searchParams = new URLSearchParams();
            searchParams.set("page", pageNumber); // 追加したいクエリパラメータ
            setCurrentPage(pageNumber);
            history({search: searchParams.toString()});
        }
    };

    return (
        <nav aria-label="...">
            <ul className="pagination">
                {currentPage > 0 && (
                    <li className="page-item">
                        <a className="page-link" onClick={() => addQueryParam(currentPage - 1)}>
                            {currentPage - 1}
                        </a>
                    </li>
                )}
                <li className="page-item active" aria-current="page">
                    <span className="page-link">{currentPage}</span>
                </li>
                {currentPage < pages && (
                    <li className="page-item">
                        <a className="page-link" onClick={() => addQueryParam(currentPage + 1)}>
                            {currentPage + 1}
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
};
function RequestFactcheck_list({contracts, reloadKey}) {
    let history = useNavigate();
    const [request_fc_list, setRequestFc_list] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    // const pages = Math.ceil(items.length / itemsPerPage);
    let query = useQuery();
    const [pages, setPages] = useState(0);
    const [sortOrder, setSortOrder] = useState(query.get("page") || "newest");
    const [itemMax, setItemMax] = useState(undefined);

    useEffect(() => {
        async function getContract() {
            setCurrentPage(Number(query.get("page")));
            setPages(Math.ceil(Number(await contracts.getRequestsLen()) / itemsPerPage) - 1);
            setItemMax(Number(await contracts.getRequestsLen()));
        }
        getContract();
    }, []);

    useEffect(() => {
        async function getContract() {
            let list = [];
            if (itemMax === undefined) {
                let _itemMax = Number(await contracts.getRequestsLen());
                if (sortOrder === "newest") {
                    let start = _itemMax - Number(query.get("page")) * itemsPerPage - 1;
                    let end = start - itemsPerPage + 1;
                    list = Array.from({length: start - end + 1}, (_, i) => start - i);
                } else {
                    let start = Number(query.get("page")) * itemsPerPage;
                    let end = start + itemsPerPage - 1;

                    list = Array.from({length: end - start + 1}, (_, i) => start + i);

                    list = list.reverse();
                }
            } else {
                if (sortOrder === "newest") {
                    let start = itemMax - Number(query.get("page")) * itemsPerPage - 1;
                    let end = start - itemsPerPage + 1;
                    list = Array.from({length: start - end + 1}, (_, i) => start - i);
                } else {
                    let start = Number(query.get("page")) * itemsPerPage;
                    let end = start + itemsPerPage - 1;
                    list = Array.from({length: end - start + 1}, (_, i) => start + i);
                }
            }
            //フィルターを用いて範囲外の数値を除外
            list = list.filter((i) => i >= 0);
            setRequestFc_list(await contracts.getRequests(list));
        }
        getContract();
    }, [currentPage, sortOrder]);

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
        setCurrentPage(0);
        const searchParams = new URLSearchParams();
        searchParams.set("page", 0);
        searchParams.set("sord", e.target.value);
        history({search: searchParams.toString()});
    };

    function convertepochtime(epochtime) {
        let date = new Date(epochtime.toString() * 1000);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月を取得し、2桁にパディング
        const day = date.getDate().toString().padStart(2, "0"); // 日を取得し、2桁にパディング
        const hours = date.getHours().toString().padStart(2, "0"); // 時を取得し、2桁にパディング
        const minutes = date.getMinutes().toString().padStart(2, "0"); // 分を取得し、2桁にパディング
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    return (
        <div>
            <h3>ファクトチェックのリクエスト</h3>
            <Form>
                <Form.Group controlId="sortOrder">
                    <Form.Label>ソート順</Form.Label>
                    <Form.Control as="select" value={sortOrder} onChange={(e) => handleSortOrderChange(e)}>
                        <option value="newest">新着順</option>
                        <option value="oldest">古い順</option>
                    </Form.Control>
                </Form.Group>
            </Form>
            {request_fc_list.map((request_fc, index) => (
                <Link className="card" key={index} to={"/factcheck/browse/" + request_fc.id} style={{textDecoration: "none"}}>
                    <div className="row">
                        <div className="col-3">
                            <div className="thumbnail">
                                <img src={request_fc.thumbnail_url} alt="サムネイル" className="thumbnail" />
                            </div>
                        </div>
                        <div className="col-9">
                            <h4 className="mb-0">{request_fc.title}</h4>
                            <p>{request_fc.description}</p>
                            <div className="row">
                                <div className="col-4">
                                    <p>依頼者：{request_fc.author.slice(0, 10)}</p>
                                </div>
                                <div className="col-4">
                                    <p>投稿日：{convertepochtime(request_fc.created_at)}</p>
                                </div>
                                <div className="col-4">
                                    <p>締切：{convertepochtime(request_fc.deadline)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                <Pagination pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} history={history} />
            </div>
        </div>
    );
}

export default RequestFactcheck_list;
