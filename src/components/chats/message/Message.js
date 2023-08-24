import React, { useEffect, useRef, useState } from "react";
import "./Message.scss";
import { auth } from "../../../firebase";

import Cross from "../../../assets/cross.png";
import dayjs from "dayjs";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import Modal from "../../modal/Modal";

const Message = ({ user, message }) => {
  const [showPic, setShowPic] = useState(false);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  }, [user]);

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
        {message?.img && (
          <LazyLoadImage
            alt=""
            effect="blur"
            src={message.img}
            onClick={() => setShowPic(true)}
          />
        )}
        {showPic && (
          <Modal onClose={() => setShowPic(false)}>
            <LazyLoadImage alt="" effect="blur" src={message.img} />
            <img
              className="cross"
              src={Cross}
              onClick={() => setShowPic(false)}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Message;
