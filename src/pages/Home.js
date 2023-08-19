import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Chat from "../components/chat/Chat";
import "./Home.scss";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import { Link } from "react-router-dom";
import Spinner from "../components/spinner/Spinner";

const Home = () => {
  const { width, height } = useSelector((state) => state.dimension);
  const { isLoggedIn } = useSelector((state) => state.authentication);
  return (
    <div className="home">
      {isLoggedIn === null && <Spinner initial={true} />}
      {isLoggedIn === false && (
        <div className="loginOrRegister">
          <div className="title">Login/Register to continue</div>
          <div className="controls">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      )}

      {isLoggedIn === true && (
        <div className="container">
          <Sidebar />
          {width > 1000 && <Chat />}
        </div>
      )}
    </div>
  );
};

export default Home;
