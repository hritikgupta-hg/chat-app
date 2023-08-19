import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import "./style.scss";
// import addAvatar from "../assets/addAvatar1.png";
import { auth } from "../firebase";
import Spinner from "../components/spinner/Spinner";

const Login = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    setSigningIn(true);
    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSigningIn(false);
      navigate("/");
    } catch (error) {
      setSigningIn(false);
      setErr(true);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div className="logo">Chat App</div>
        <div className="title">Login</div>
        <form onSubmit={submitHandler}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          {!signingIn && <button>Sign in</button>}
          {signingIn && (
            <div className="processing">
              <Spinner initial={true} />
              <p>signing in...</p>
            </div>
          )}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Do not have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
