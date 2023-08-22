import React, { useState } from "react";
import Modal from "../../modal/Modal";
import Img from "../../lazyLoadImage/Img";

const UserChat = ({ chat, userChatSelectHandler }) => {
  const [showProfilePic, setShowProfilePic] = useState(false);
  return (
    <div>
      <div key={chat[0]} className="userChat">
        <img
          src={chat[1].userInfo?.photoURL}
          onClick={() => setShowProfilePic(true)}
        />

        {showProfilePic && (
          <Modal onClose={() => setShowProfilePic(false)}>
            <Img src={chat[1].userInfo?.photoURL} />
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
    </div>
  );
};

export default UserChat;
