import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StockDetails = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const { stockId } = useParams();
  console.log("stockDetail-stockId", stockId);
  // TODO: 去後端撈資料
  // TODO: 1. axios.get -> 在哪個 useEffect 裡做？
  useEffect(() => {
    console.log("useEffect[]", data);
    let getStockDetail = async () => {
      let response = await axios.get(
        `http://localhost:3002/api/1.0/stocks/${stockId}`
      );
      setData(response.data);
      console.log("useEffect[] after set", data);
    };
    getStockDetail();
  }, []);
  // TODO: 2. setData
  useEffect(() => {
    console.log("useEffect[data]", data);
  }, [data]);
  return (
    <div>
      {error && <div>{error}</div>}
      {/* TODO: 3. 在畫面上 render 資料, data.map */}
      {/*     stock_id: '2330',
    date: 2022-08-11T16:00:00.000Z,
    open_price: '515.00',
    high_price: '518.00',
    low_price: '514.00',
    close_price: '517.00',
    delta_price: '3.00',
    transactions: 21701,
    volume: 21343450,
    amount: '11016097043.00' */}
      {data.map((v, i) => {
        return (
          <div className="bg-white bg-gray-50 p-6 rounded-lg shadow m-6">
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
