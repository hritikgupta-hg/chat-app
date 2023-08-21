import React, { useEffect, useState } from "react";
import Message from "../chats/message/Message";

import "./Messages.scss";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import Spinner from "../spinner/Spinner";

const Messages = ({ user, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(chatId);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
        setLoading(false);
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
      {loading && <Spinner initial={true} />}
      {!loading &&
        messages.map((m) => <Message key={m.id} user={user} message={m} />)}
    </div>
  );
};

export default Messages;
