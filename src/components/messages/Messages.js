import React, { useEffect, useState } from "react";
import Message from "../chats/message/Message";

import "./Messages.scss";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Messages = ({ user, chatId }) => {
  const [messages, setMessages] = useState([]);
  console.log(chatId);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
        setMessages(doc.data().messages);
      });

      return () => {
        unSub();
      };
    }
  }, [chatId]);

  console.log(messages);
  return (
    <div className="messages">
      {messages.map((m) => (
        <Message key={m.id} user={user} message={m} />
      ))}
    </div>
  );
};

export default Messages;
