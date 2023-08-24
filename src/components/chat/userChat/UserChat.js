import React, { useState } from "react";
import Modal from "../../modal/Modal";
import Img from "../../lazyLoadImage/Img";
import Cross from "../../../assets/cross.png";
import "./userChat.scss";
import DefaultDisplayImage from "../../../assets/user.png";

const UserChat = ({ chat, userChatSelectHandler }) => {
  const [showProfilePic, setShowProfilePic] = useState(false);
  return (
    <div key={chat[0]} className="userChat">
      <img
        src={
          chat[1].userInfo?.photoURL
            ? chat[1].userInfo?.photoURL
            : DefaultDisplayImage
        }
        onClick={() => setShowProfilePic(true)}
      />

      {showProfilePic && (
        <Modal onClose={() => setShowProfilePic(false)}>
          {chat[1].userInfo?.photoURL && (
            <Img src={chat[1].userInfo?.photoURL} />
          )}
          {!chat[1].userInfo?.photoURL && <div>No Display Picture</div>}
          <img
            className="cross"
            src={Cross}
            onClick={() => setShowProfilePic(false)}
          />
        </Modal>
      )}
      <div
        className="userChatInfo"
        onClick={() => userChatSelectHandler(chat[1].userInfo)}
      >
        <div className="title">{chat[1].userInfo?.displayName}</div>
        <div className="latestMessage">{chat[1]?.lastMessage?.text}</div>
      </div>
    </div>
  );
};

export default UserChat;
