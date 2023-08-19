import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

import "./Chats.scss";
import { auth, db } from "../../firebase";
import { chatActions } from "../../store/chatSlice";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const { width } = useSelector((state) => state.dimension);
  const { height } = useSelector((state) => state.dimension);

  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // console.log(height);
  // console.log(width);

  // useEffect(() => {
  //   function handleResize() {
  //     setDimensions({
  //       height: window.innerHeight,
  //       width: window.innerWidth,
  //     });
  //   }

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [dimensions.height, dimensions.width]);

  // console.log(dimensions.width);
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userChats", auth.currentUser.uid),
      (doc) => {
        setChats(doc.data());
      }
    );

    return () => {
      unsub();
    };
  }, [auth.currentUser.uid]);

  // console.log(chats);
  // console.log(Object.entries(chats));

  const userChatSelectHandler = (selectedUser) => {
    dispatch(chatActions.changeUser(selectedUser));
    if (width <= 1000) navigate("/home/chat");
  };

  return (
    <div className="chats">
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              onClick={() => userChatSelectHandler(chat[1].userInfo)}
              key={chat[0]}
              className="userChat"
            >
              <img src={chat[1].userInfo?.photoURL} />
              <div className="userChatInfo">
                <div className="title">{chat[1].userInfo?.displayName}</div>
                <div className="latestMessage">
                  {chat[1]?.lastMessage?.text}
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Chats;
