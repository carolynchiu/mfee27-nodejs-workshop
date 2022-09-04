import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Stock from "./components/Stock";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import StockDetails from "./components/StockDetails";
import NotFound from "./components/NotFound";
import { AuthContext } from "./context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./utils/config";

function App() {
  const [member, setMember] = useState(null);

  useEffect(() => {
    // 去要要看有沒有會員資料，有要到就是已經登入過
    let getMember = async () => {
      console.log("in APP: check if login");
      let response = await axios.get(`${API_URL}/member`, {
        withCredentials: true,
      });
      setMember(response.data);
    };
    getMember();
  }, []);

  return (
    <AuthContext.Provider value={{ member, setMember }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Stock />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stock/:stockId" element={<StockDetails />}>
            <Route path=":currentPage" element={<StockDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
