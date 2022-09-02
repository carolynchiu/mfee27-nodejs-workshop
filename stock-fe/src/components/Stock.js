import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/config";

const Stock = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // didMount
  useEffect(() => {
    console.log("useEffect[]", data);
    // call API
    let getStock = async () => {
      //......................."http://localhost:3002/api/1.0/stocks"
      let response = await axios.get(`${API_URL}/stocks`);
      setData(response.data);
      console.log("useEffect[] after set", data);
    };
    getStock();
  }, []);

  // useEffect(() => {
  //   console.log("useEffect[data]", data);
  // }, [data]);

  return (
    <div>
      {error && <div>{error}</div>}
      <h2 className="ml-7 mt-6 text-xl text-gray-600">股票代碼</h2>
      {data.map((stock) => {
        return (
          <div
            key={stock.id}
            className="bg-white bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg m-6 cursor-pointer"
          >
            {/* 
              因為看 App.js -> <Route path="/stock/:stockId" element={<StockDetails />}>
              所以 <Link to={`/stock/:stockId`}> 
              但 :stockId 現在是 ${stock.id}
              ex. stock.id = 2330
              網址就會是 -> http://localhost:3000/stock/2330
          */}
            <Link to={`/stock/${stock.id}`}>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {stock.id}
              </h2>
              <p className="text-gray-700">{stock.name}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Stock;
