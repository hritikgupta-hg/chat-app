import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import "./Chats.scss";
import { auth, db } from "../../firebase";
import { chatActions } from "../../store/chatSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";

import UserChat from "../chat/userChat/UserChat";

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
    if (width <= 1000) navigate(`chat/${selectedUser.uid}`);
  };

  console.log(chats);
  return (
    <div className="chats">
      {loading && <Spinner initial={true} />}
      {!loading &&
        chats?.map((chat) => (
          <UserChat chat={chat} userChatSelectHandler={userChatSelectHandler} />
        ))}
    </div>
  );
};

export default Chats;
