import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StockDetails = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  //TODO: 增加 lastPage(總頁數) 與 page (目前在第幾頁) 的 state
  const [lastPage, setLastPage] = useState(5);
  const [page, setPage] = useState(1);

  const { stockId } = useParams();
  console.log("stockDetail-stockId", stockId);
  // 去後端撈資料
  // 1. axios.get -> 在哪個 useEffect 裡做？
  useEffect(() => {
    console.log("useEffect[]", data);
    let getStockDetail = async () => {
      let response = await axios.get(
        `http://localhost:3002/api/1.0/stocks/${stockId}?page=${page}`
      );
      // 2. setData
      setData(response.data.data);
      //TODO:從後端取得資料後，要從 pagination 物件裡取得總頁數 (lastPage)
      setLastPage(response.data.pagination.lastPage);
    };
    getStockDetail();
    //TODO:在 page 的 effect 去後端取得該頁資料
  }, [page]);

  //TODO:先開發頁碼，可以透過修改 lastPage 與 page 這兩個 state 的預設值來測試
  // 製作頁碼按鈕
  const getPages = () => {
    let pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <li
          style={{
            display: "inline-block",
            margin: "2px",
            backgroundColor: page === i ? "#00d1b2" : "",
            borderColor: page === i ? "#00d1b2" : "#dbdbdb",
            color: page === i ? "#fff" : "#363636",
            borderWidth: "1px",
            width: "28px",
            height: "28px",
            borderRadius: "3px",
            textAlign: "center",
          }}
          key={i}
          onClick={(e) => {
            //TODO:頁碼點擊後，要 setPage 去改變 page state
            setPage(i);
          }}
        >
          {i}
        </li>
      );
    }
    return pages;
  };

  return (
    <div>
      {error && <div>{error}</div>}
      {/* 放一下頁碼 */}
      <ul>{getPages()}</ul>
      目前在第 {page} 頁{/* TODO: 3. 在畫面上 render 資料, data.map */}
      {data.map((v, i) => {
        return (
          <div
            key={v.date}
            className="bg-white bg-gray-50 p-6 rounded-lg shadow m-6"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              日期：{v.date}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交金額：{v.transactions}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交股數：{v.volume}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              開盤價：{v.open_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              收盤價：{v.close_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              漲跌價差：{v.delta_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              最高價：{v.high_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              最低價：{v.low_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交筆數：{v.amount}
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default StockDetails;
