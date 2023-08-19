import React, { useEffect, useRef } from "react";
import "./Message.scss";
import { auth } from "../../../firebase";

const Message = ({ user, message }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  }, []);

  const messageClass = message.senderId === auth.currentUser.uid ? "owner" : "";
  return (
    <div ref={ref} className={`message ${messageClass}`}>
      <div className="messageInfo">
        <img
          src={
            message.senderId === user.uid
              ? user.photoURL
              : auth.currentUser.photoURL
          }
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        {message.text.length > 0 && <p>{message.text}</p>}
        {message?.img && <img src={message.img}></img>}
      </div>
    </div>
  );
};

export default Message;
