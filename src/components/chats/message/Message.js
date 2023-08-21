import React, { useEffect, useRef } from "react";
import "./Message.scss";
import { auth } from "../../../firebase";
import Img from "../../lazyLoadImage/Img";
import dayjs from "dayjs";

const Message = ({ user, message }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  }, []);
  const date = message.date;
  console.log(date.toDate());
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
        <span>{dayjs(date.toDate()).format("MMM D, YYYY hh:mm A")}</span>
      </div>
      <div className="messageContent">
        {message.text.length > 0 && <div className="text">{message.text}</div>}
        {message?.img && <Img src={message.img} />}
      </div>
    </div>
  );
};

export default Message;
