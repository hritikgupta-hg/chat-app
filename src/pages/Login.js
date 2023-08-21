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
  const [inpEmail, setInpEmail] = useState("");
  const [inpPass, setInpPass] = useState("");

  const [inpEmailIsTouched, setInputEmailIsTouched] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isInputEmailValid = !inpEmailIsTouched || validateEmail(inpEmail);

  const disabled = !isInputEmailValid;

  const submitHandler = async (event) => {
    event.preventDefault();

    setSigningIn(true);
    const email = inpEmail;
    const password = inpPass;

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
        <div className="logo">ChatterBOX</div>
        <form
          onSubmit={() => {
            if (disabled) return;
            submitHandler();
          }}
        >
          <div className="title">Login</div>
          <input
            className={!isInputEmailValid ? "invalid" : ""}
            type="email"
            placeholder="email"
            onBlur={() => setInputEmailIsTouched(true)}
            onChange={(e) => setInpEmail(e.target.value)}
            autoFocus
          />
          {!isInputEmailValid && (
            <div className="errorMessage">Enter Valid Email</div>
          )}
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setInpPass(e.target.value)}
          />
          {!signingIn && (
            <button
              className={disabled ? "disabled" : ""}
              onClick={submitHandler}
              disabled={disabled}
            >
              Sign Up
            </button>
          )}

          {signingIn && (
            <div className="processing">
              <Spinner initial={true} />
              <p>signing in...</p>
            </div>
          )}
          {err && <div className="errorMessage">Something went wrong</div>}
        </form>
        <p>
          Do not have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
