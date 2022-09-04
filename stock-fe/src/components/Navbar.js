import { Link, NavLink } from "react-router-dom";
import Logo from "../img/fish.png";
import axios from "axios";
import { API_URL, IMAGE_URL } from "../utils/config";
import { useAuth } from "../context/auth";

const Navbar = () => {
  // 把 member, setMember 從 auth context 裡頭拿出來
  const { member, setMember } = useAuth();

  async function handleLogout() {
    let response = await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true,
    });
    console.log(response.data);
    setMember(null);
  }

  return (
    <nav className="bg-indigo-100 px-10 py-3 flex justify-between items-center sticky shadow">
      <Link to={"/"}>
        <div className="flex items-center cursor-pointer">
          <img src={Logo} width="50" alt="Logo" className="mr-2" />
          <span className="text-2xl text-gray-700 text-opacity-70">魚股市</span>
        </div>
      </Link>

      <div className="flex items-center ">
        <NavLink
          to="/"
          className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
          activestyle={{ fontWeight: "bold", color: "#3B82F6" }}
        >
          股票
        </NavLink>
        <NavLink
          to="/about"
          className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
          activestyle={{ fontWeight: "bold", color: "#3B82F6" }}
        >
          關於
        </NavLink>
        {member ? (
          <>
            {/* 登入後顯示的 */}
            Hi, {member.name}
            <img src={IMAGE_URL + member.photo} style={{ width: "80px" }} />
            <Link
              to="/about"
              onClick={handleLogout}
              className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
            >
              登出
            </Link>
          </>
        ) : (
          <>
            {/* 登入前顯示的 */}
            <NavLink
              to="/login"
              className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
              activestyle={{ fontWeight: "bold", color: "#3B82F6" }}
            >
              登入
            </NavLink>
            <NavLink
              to="/register"
              className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
              activestyle={{ fontWeight: "bold", color: "#3B82F6" }}
            >
              註冊
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
