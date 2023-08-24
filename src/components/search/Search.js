import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../store/chatSlice";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FaAngleDoubleUp } from "react-icons/fa";
import { FaAngleDoubleDown } from "react-icons/fa";

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
  const [collapseSearchResults, setCollapseSearchResults] = useState(false);

  const matchUserName = (name) => {
    const re = new RegExp(`${username.trim().toLowerCase()}`);
    return name.match(re);
  };
  const handleSearch = async () => {
    setSearching(true);
    // const q = query(usersRef, where("displayName", "==", username.trim()));
    try {
      const usersRef = collection(db, "users");
      const users = await getDocs(usersRef);

      const data = [];
      users.forEach((doc) => {
        if (matchUserName(doc.data().displayName.toLowerCase()))
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

  // const userChatSelectHandler = (selectedUser) => {
  //   console.log(selectedUser);
  //   if (selectedUser.uid === auth.currentUser.uid) return;

  //   dispatch(chatActions.changeUser(selectedUser));
  //   if (width <= 1000) navigate(`chat/${selectedUser.uid}`);
  // };

  const selectHandler = async (user) => {
    //check whether the group(chats in firestore) exists, if not create

    try {
      if (user.uid === auth.currentUser.uid) return;
      const combinedId =
        auth.currentUser.uid > user.uid
          ? auth.currentUser.uid + user.uid
          : user.uid + auth.currentUser.uid;

      console.log(combinedId);
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

      setUsername("");
      setUsers(null);

      dispatch(
        chatActions.changeUser({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        })
      );
      if (width <= 1000) navigate(`chat/${user.uid}`);
    } catch (err) {}
    //create user chats
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
            setCollapseSearchResults(false);
            setUsers(null);
            setErr(null);
            setUsername(event.target.value);
          }}
        />
        {searching && <Spinner initial={true} />}
        {!searching && <button onClick={handleSearch}>Search</button>}
      </div>
      {err && <div className="notFound">No user found </div>}
      {users && (
        <div className="searchResultContainer">
          <div
            className={`searchResult ${
              collapseSearchResults ? "collapse" : ""
            }`}
          >
            {users.map((item) => (
              <SearchResultItem user={item} onSelect={selectHandler} />
            ))}
          </div>

          {!collapseSearchResults && (
            <FaAngleDoubleUp
              className="collapseBtn"
              onClick={() => setCollapseSearchResults(true)}
            />
          )}
          {collapseSearchResults && (
            <FaAngleDoubleDown
              className="collapseBtn"
              onClick={() => setCollapseSearchResults(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
