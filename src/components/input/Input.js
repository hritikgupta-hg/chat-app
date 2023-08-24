import React, { useState } from "react";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import "./Input.scss";
//import Attach from "../../assets/attach.png";
import Img from "../../assets/add-image.png";
import cross from "../../assets/cross-sign.png";
import { auth, db, storage } from "../../firebase";
import Spinner from "../spinner/Spinner";

const Input = ({ user, chatId }) => {
  const [img, setImg] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  console.log(img);
  const sendHandler = async () => {
    setSending(true);
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(downloadURL);
            await updateDoc(doc(db, "chats", chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: auth.currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: auth.currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", auth.currentUser.uid), {
      [chatId + ".date"]: serverTimestamp(),
      [chatId + ".lastMessage"]: { text },
    });

    await updateDoc(doc(db, "userChats", user?.uid), {
      [chatId + ".date"]: serverTimestamp(),
      [chatId + ".lastMessage"]: { text },
    });

    setSending(false);
    setText("");
    setImg(null);
  };
  return (
    <div className="inputWithSelectedImg">
      <div className={`selectedImage ${img && "visible"}`}>
        <div>{img?.name}</div>
        <img onClick={() => setImg(null)} src={cross}></img>
      </div>

      <div className="input">
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="send">
          <label htmlFor="file">
            <img src={Img} />
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          {sending && <Spinner initial={true} />}
          {!sending && (
            <button
              className={!img && !text && "disabled"}
              disabled={!img && !text}
              onClick={sendHandler}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Input;
