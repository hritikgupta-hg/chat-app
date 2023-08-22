import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chatSlice";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

import { useNavigate } from "react-router-dom";

import "./Search.scss";
import SearchResultItem from "../searchResultItem/SearchResultItem";
import { auth } from "../../firebase";
import Spinner from "../spinner/Spinner";

const Search = () => {
  const { width } = useSelector((state) => state.dimension);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState(null);
  const [err, setErr] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", username));
    try {
      const querySnapshot = await getDocs(q);

      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      if (data.length === 0) {
        throw new Error("No user found!");
      }

      setSearching(false);
      setUsers(data);
    } catch (error) {
      setSearching(false);
      setErr(error);
    }
  };

  const handleKey = (event) => {
    event.code === "Enter" && handleSearch();
  };

  const userChatSelectHandler = (selectedUser) => {
    dispatch(chatActions.changeUser(selectedUser));
    if (width <= 1000) navigate("/home/chat");
  };

  const selectHandler = async (user) => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      auth.currentUser.uid > user.uid
        ? auth.currentUser.uid + user.uid
        : user.uid + auth.currentUser.uid;

    console.log(combinedId);

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      console.log(res.exists());
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", auth.currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      userChatSelectHandler({
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      });
    } catch (err) {}
    //create user chats

    setUsername("");
    setUsers(null);
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          value={username}
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(event) => {
            setUsers(null);
            setErr(null);
            setUsername(event.target.value);
          }}
        />
        {searching && <Spinner initial={true} />}
        {!searching && <button onClick={handleSearch}>Search</button>}
      </div>
      {err && <span>User not found</span>}
      {users &&
        users.map((item) => (
          <SearchResultItem user={item} onSelect={selectHandler} />
        ))}
    </div>
  );
};

export default Search;
