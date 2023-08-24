import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";

import "./ChatMobile.scss";
import { auth, db } from "../../../firebase";
import Back from "../../../assets/back_arrow.png";
import Cross from "../../../assets/cross.png";
import Modal from "../../modal/Modal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Messages from "../../messages/Messages";
import Input from "../../input/Input";
import Spinner from "../../spinner/Spinner";

const ChatMobile = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [showProfilePic, setShowProfilePic] = useState(false);
  //   const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const userId = params.userId;
  const currentUserId = auth.currentUser?.uid;

  let chatId =
    currentUserId > userId ? currentUserId + userId : userId + currentUserId;

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await getDoc(doc(db, "users", userId));
      if (userInfo.exists()) {
        setUser(userInfo.data());
      } else {
        console.log("user does not exist!");
      }
    };

    if (userId) getUserInfo();
  }, [userId]);

  return (
    <div className="chatMobile">
      {!user && <Spinner initial={true} />}
      {user && (
        <>
          <div className="chatInfo">
            <img
              className="back"
              src={Back}
              onClick={() => navigate("/")}
            ></img>

            <div>{user?.displayName}</div>
            <img
              className="userProfilePic"
              src={user?.photoURL}
              onClick={() => setShowProfilePic(true)}
            />
            {showProfilePic && (
              <Modal onClose={() => setShowProfilePic(false)}>
                <LazyLoadImage alt="" effect="blur" src={user?.photoURL} />
                <img
                  className="cross"
                  src={Cross}
                  onClick={() => setShowProfilePic(false)}
                />
              </Modal>
            )}

            {/* <div className="chatIcons">
              <img src={Cam} />
              <img src={Add} />
              <img src={More} />
            </div> */}
          </div>
          <Messages user={user} chatId={chatId} />
          <Input user={user} chatId={chatId} />
        </>
      )}
    </div>
  );
};

export default ChatMobile;
