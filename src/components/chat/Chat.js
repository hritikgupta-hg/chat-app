import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";

import "./Chat.scss";
// import Cam from "../../assets/cam.png";
// import Add from "../../assets/add.png";
// import More from "../../assets/more.png";
import Messages from "../messages/Messages";
import Input from "../input/Input";
import { useNavigate } from "react-router-dom";
import Img from "../lazyLoadImage/Img";
import Modal from "../modal/Modal";
import Cross from "../../assets/cross.png";
import DefaultDisplayImage from "../../assets/user.png";

const Chat = () => {
  const navigate = useNavigate();
  const { width } = useSelector((state) => state.dimension);
  const [showProfilePic, setShowProfilePic] = useState(false);

  const { user, chatId } = useSelector((state) => state.chat);
  if (!user && width <= 1000) navigate("/");

  return (
    <div className="chat">
      {!user && (
        <div className="initialMessage">start chatting with someone...👋</div>
      )}
      {user && (
        <>
          <div className="chatInfo">
            <div>{user?.displayName}</div>
            <img
              className="userProfilePic"
              src={user.photoURL ? user.photoURL : DefaultDisplayImage}
              onClick={() => setShowProfilePic(true)}
            />
            {showProfilePic && (
              <Modal onClose={() => setShowProfilePic(false)}>
                <img
                  className="cross"
                  src={Cross}
                  onClick={() => setShowProfilePic(false)}
                />
                {user.photoURL && <Img src={user.photoURL} />}
                {!user.photoURL && <div>No Display Picture</div>}
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

export default Chat;
