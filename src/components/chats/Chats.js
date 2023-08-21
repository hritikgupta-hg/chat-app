import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import "./Chats.scss";
import { auth, db } from "../../firebase";
import { chatActions } from "../../store/chatSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";

const Chats = () => {
  const { width } = useSelector((state) => state.dimension);
  // const { height } = useSelector((state) => state.dimension);

  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log(loading);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      doc(db, "userChats", auth.currentUser.uid),
      (doc) => {
        const data = Object.entries(doc.data()).sort(
          (a, b) => b[1].date - a[1].date
        );
        setChats(data);
        setLoading(false);
      }
    );

    return () => {
      unsub();
    };
  }, [auth.currentUser.uid]);

  const userChatSelectHandler = (selectedUser) => {
    dispatch(chatActions.changeUser(selectedUser));
    if (width <= 1000) navigate("/home/chat");
  };

  console.log(chats);
  return (
    <div className="chats">
      {loading && <Spinner initial={true} />}
      {!loading &&
        chats?.map((chat) => (
          <div
            onClick={() => userChatSelectHandler(chat[1].userInfo)}
            key={chat[0]}
            className="userChat"
          >
            <img src={chat[1].userInfo?.photoURL} />
            <div className="userChatInfo">
              <div className="title">{chat[1].userInfo?.displayName}</div>
              <div className="latestMessage">{chat[1]?.lastMessage?.text}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
