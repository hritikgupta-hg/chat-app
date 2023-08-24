import React, { useState } from "react";

import "./Navbar.scss";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import Modal from "../modal/Modal";
import Img from "../lazyLoadImage/Img";
import Cross from "../../assets/cross.png";
import DefaultDisplayImage from "../../assets/user.png";

const Navbar = () => {
  const [showProfilePic, setShowProfilePic] = useState(false);
  return (
    <div className="navbar">
      <div className="logo">ChatterBOX</div>
      <div className="user">
        <img
          src={
            auth.currentUser.photoURL
              ? auth.currentUser.photoURL
              : DefaultDisplayImage
          }
          alt=""
          onClick={() => setShowProfilePic(true)}
        ></img>
        {showProfilePic && (
          <Modal onClose={() => setShowProfilePic(false)}>
            {auth.currentUser.photoURL && (
              <Img src={auth.currentUser.photoURL} />
            )}
            {!auth.currentUser.photoURL && <div>No Display Picture</div>}
            <img
              className="cross"
              src={Cross}
              onClick={() => setShowProfilePic(false)}
            />
          </Modal>
        )}
        <span>{auth.currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
