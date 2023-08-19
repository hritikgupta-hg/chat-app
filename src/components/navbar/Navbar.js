import React from "react";

import "./Navbar.scss";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">ChatterBOX</div>
      <div className="user">
        <img src={auth.currentUser.photoURL} alt=""></img>
        <span>{auth.currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
